import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all conversations for a user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getConversations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Find conversations where user is a participant
    const conversationsCount = await Conversation.countDocuments({
      participants: req.user._id,
      isActive: true,
    });
    
    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true,
    })
      .populate({
        path: 'participants',
        select: 'firstName lastName profileImage',
        match: { _id: { $ne: req.user._id } }, // Exclude current user
      })
      .populate({
        path: 'lastMessage',
        select: 'content createdAt',
      })
      .populate({
        path: 'job',
        select: 'title',
      })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });
    
    // Get unread count for each conversation
    const conversationsWithUnreadCount = conversations.map(conversation => {
      const unreadCountForUser = conversation.unreadCount.get(req.user._id.toString()) || 0;
      return {
        ...conversation.toObject(),
        unreadCount: unreadCountForUser,
      };
    });
    
    return successResponse(res, {
      conversations: conversationsWithUnreadCount,
      page,
      limit,
      totalConversations: conversationsCount,
      totalPages: Math.ceil(conversationsCount / limit),
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get or create a conversation with another user
 * @route   POST /api/messages/conversations
 * @access  Private
 */
export const createConversation = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    
    // Validate other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return errorResponse(res, 'User not found', 404);
    }
    
    // Create or get conversation
    let conversation;
    
    // If jobId is provided, check for existing conversation about this job
    if (jobId) {
      conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, userId] },
        job: jobId,
      });
    } else {
      // Without job, check for direct conversation between users
      conversation = await Conversation.findBetweenUsers(req.user._id, userId);
    }
    
    // If no conversation exists, create a new one
    if (!conversation) {
      const conversationData = {
        participants: [req.user._id, userId].sort(),
        job: jobId || undefined,
      };
      
      // Initialize unread count for both participants
      const unreadCount = new Map();
      conversationData.participants.forEach(participant => {
        unreadCount.set(participant.toString(), 0);
      });
      
      conversationData.unreadCount = unreadCount;
      
      conversation = await Conversation.create(conversationData);
    }
    
    // Populate conversation
    await conversation.populate([
      {
        path: 'participants',
        select: 'firstName lastName profileImage',
      },
      {
        path: 'job',
        select: 'title',
      },
    ]);
    
    return successResponse(res, { conversation }, 201);
  } catch (error) {
    console.error('Create conversation error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/messages/conversations/:id
 * @access  Private
 */
export const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Check if conversation exists and user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });
    
    if (!conversation) {
      return errorResponse(res, 'Conversation not found or you are not a participant', 404);
    }
    
    // Get total message count
    const messageCount = await Message.countDocuments({
      conversation: conversationId,
    });
    
    // Get messages in descending order (newest first)
    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate('sender', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Mark messages as read for the current user
    await Promise.all(
      messages.map(async (message) => {
        // Only mark messages from other users as read
        if (message.sender._id.toString() !== req.user._id.toString()) {
          await message.markAsRead(req.user._id);
        }
      })
    );
    
    // Reset unread count for this user in the conversation
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();
    
    return successResponse(res, {
      messages: messages.reverse(), // Reverse to get oldest first
      page,
      limit,
      totalMessages: messageCount,
      totalPages: Math.ceil(messageCount / limit),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const message = new Message({ conversationId, senderId, text });
    await message.save();

    // Notify other participants
    const otherParticipants = conversation.participants.filter(
      (participantId) => participantId.toString() !== senderId
    );

    await Promise.all(
      otherParticipants.map(async (participantId) => {
        const notification = new Notification({
          user: participantId,
          type: "message",
          message: `New message from ${senderId}`,
        });
        await notification.save();

        // Emit to the recipient's socket room
        io.to(participantId.toString()).emit("new_message", {
          conversationId,
          message,
        });

        // Optional: emit notification
        io.to(participantId.toString()).emit("new_notification", {
          type: "message",
          from: senderId,
        });
      })
    );

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};


/**
 * @desc    Delete a conversation
 * @route   DELETE /api/messages/conversations/:id
 * @access  Private
 */
export const deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    
    // Check if conversation exists and user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });
    
    if (!conversation) {
      return errorResponse(res, 'Conversation not found or you are not a participant', 404);
    }
    
    // Soft delete by setting isActive to false
    conversation.isActive = false;
    await conversation.save();
    
    return successResponse(res, {
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    
    // Find message and check if user is the sender
    const message = await Message.findById(messageId);
    
    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }
    
    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'You can only delete your own messages', 403);
    }
    
    // If message has attachments, delete them
   
    
    // Delete message
    await message.remove();
    
    return successResponse(res, {
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return errorResponse(res, error.message, 500);
  }
};
