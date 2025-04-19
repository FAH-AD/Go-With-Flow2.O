import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    // For archived conversations
    archivedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ job: 1 });
conversationSchema.index({ lastMessage: 1 });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model('Conversation', conversationSchema);