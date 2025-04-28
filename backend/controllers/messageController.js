import Message from "../models/Message.js"
import Conversation from "../models/Conversation.js"
import User from "../models/User.js"
import { successResponse, errorResponse } from "../utils/apiResponse.js"

/**
 * @desc    Get all conversations for a user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getConversations = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Find conversations where user is a participant
    const conversationsCount = await Conversation.countDocuments({
      participants: req.user._id,
      isActive: true,
    })

    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true,
    })
      .populate({
        path: "participants",
        select: "name profilePic",
      })
      .populate({
        path: "lastMessage",
        select: "content createdAt",
      })
      .populate({
        path: "job",
        select: "title",
      })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })

    // Get unread count for each conversation and format participants
    const conversationsWithUnreadCount = conversations.map((conversation) => {
      const unreadCountForUser = conversation.unreadCount.get(req.user._id.toString()) || 0
      const formattedParticipants = conversation.participants.map((participant) => ({
        ...participant.toObject(),
        isCurrentUser: participant._id.toString() === req.user._id.toString(),
      }))

      return {
        ...conversation.toObject(),
        unreadCount: unreadCountForUser,
        participants: formattedParticipants,
      }
    })

    return successResponse(res, 200, {
      conversations: conversationsWithUnreadCount,
      page,
      limit,
      totalConversations: conversationsCount,
      totalPages: Math.ceil(conversationsCount / limit),
    })
  } catch (error) {
    console.error("Get conversations error:", error)
    return errorResponse(res, 500, error.message)
  }
}

/**
 * @desc    Get or create a conversation with another user
 * @route   POST /api/messages/conversations
 * @access  Private
 */
export const createConversation = async (req, res) => {
  try {
    const { userId, jobId } = req.body

    // Validate other user exists
    const otherUser = await User.findById(userId)
    if (!otherUser) {
      return errorResponse(res, 404, "User not found")
    }

    // Create or get conversation
    let conversation

    // Check for existing conversation with the same participants and job
    const participantIds = [req.user._id, userId].sort((a, b) => a.toString().localeCompare(b.toString()))

    if (jobId) {
      conversation = await Conversation.findOne({
        participants: { $all: participantIds, $size: 2 },
        job: jobId,
      })
    } else {
      conversation = await Conversation.findOne({
        participants: { $all: participantIds, $size: 2 },
        job: { $exists: false },
      })
    }

    // If no conversation exists, create a new one
    if (!conversation) {
      const conversationData = {
        participants: participantIds,
        job: jobId || undefined,
      }

      // Initialize unread count for both participants
      const unreadCount = new Map()
      conversationData.participants.forEach((participant) => {
        unreadCount.set(participant.toString(), 0)
      })

      conversationData.unreadCount = unreadCount

      conversation = await Conversation.create(conversationData)
    }

    // Populate conversation
    await conversation.populate([
      {
        path: "participants",
        select: "name profilePic",
      },
      {
        path: "job",
        select: "title",
      },
    ])

    return successResponse(res, 201, { conversation })
  } catch (error) {
    console.error("Create conversation error:", error)
    return errorResponse(res, 500, error.message)
  }
}

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/messages/conversations/:id
 * @access  Private
 */
export const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    })

    if (!conversation) {
      return errorResponse(res, 404, "Conversation not found or you are not a participant")
    }

    const messageCount = await Message.countDocuments({
      conversation: conversationId,
    })

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "firstName lastName profileImage") // ✅ populate properly
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Mark unread messages as read
    await Promise.all(
      messages.map(async (message) => {
        if (message.sender._id.toString() !== req.user._id.toString()) {
          await message.markAsRead(req.user._id)
        }
      }),
    )

    // Reset unread count
    conversation.unreadCount.set(req.user._id.toString(), 0)
    await conversation.save()

    return successResponse(res, 200, {
      messages: messages.reverse(),
      page,
      limit,
      totalMessages: messageCount,
      totalPages: Math.ceil(messageCount / limit),
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return errorResponse(res, 500, error.message)
  }
}

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversation, content } = req.body
    const senderId = req.user._id

    // Find the conversation
    const conv = await Conversation.findById(conversation)
    if (!conv) {
      return errorResponse(res, 404, "Conversation not found")
    }

    // Create a new message
    const newMessage = new Message({
      conversation: conversation,
      sender: senderId,
      content: content,
      timestamp: new Date(),
    })

    // Save the message
    await newMessage.save()

    // Update the conversation with the new message
    conv.messages.push({
      sender: senderId,
      content: content,
      timestamp: new Date()
    })
    conv.lastMessage = newMessage._id
    conv.updatedAt = new Date()
    await conv.save()

    // Populate sender information
    await newMessage.populate("sender", "firstName lastName profileImage")

    // Emit to all participants in the conversation
    if (global.io) {
      global.io.emit("receive_message", {
        conversationId: conversation,
        message: newMessage.toObject(),})
    
    }

    console.log("Message sent:", newMessage)
    return successResponse(res, 201, { message: newMessage.toObject() })
  } catch (error) {
    console.error("Error sending message:", error)
    return errorResponse(res, 500, "Failed to send message")
  }
}

/**
 * @desc    Delete a conversation
 * @route   DELETE /api/messages/conversations/:id
 * @access  Private
 */
export const deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.id

    // Check if conversation exists and user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    })

    if (!conversation) {
      return errorResponse(res, 404, "Conversation not found or you are not a participant")
    }

    // Soft delete by setting isActive to false
    conversation.isActive = false
    await conversation.save()

    return successResponse(res, 200, {
      message: "Conversation deleted successfully",
    })
  } catch (error) {
    console.error("Delete conversation error:", error)
    return errorResponse(res, error.message, 500)
  }
}

/**
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id

    // Find message and check if user is the sender
    const message = await Message.findById(messageId)

    if (!message) {
      return errorResponse(res, 404, "Message not found")
    }

    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return errorResponse(res, 403, "You can only delete your own messages")
    }

    // If message has attachments, delete them

    // Delete message
    await message.remove()

    return successResponse(res, 200, {
      message: "Message deleted successfully",
    })
  } catch (error) {
    console.error("Delete message error:", error)
    return errorResponse(res, 500, error.message)
  }
}
