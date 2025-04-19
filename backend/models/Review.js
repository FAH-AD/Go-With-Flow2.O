import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required'],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: {
        values: ['client-to-freelancer', 'freelancer-to-client'],
        message: 'Type must be client-to-freelancer or freelancer-to-client',
      },
      required: [true, 'Type is required'],
    },
    // Additional rating categories for detailed feedback
    communication: {
      type: Number,
      min: 1,
      max: 5,
    },
    qualityOfWork: {
      type: Number,
      min: 1,
      max: 5,
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
    },
    expertise: {
      type: Number,
      min: 1,
      max: 5,
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Helpful votes from other users
    helpfulVotes: {
      type: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      }],
      default: [],
    },
    // Reports for inappropriate content
    reports: {
      type: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: {
          type: String,
          required: true,
          enum: {
            values: [
              'inappropriate-content',
              'false-information',
              'harassment',
              'spam',
              'other',
            ],
            message: 'Reason must be a valid option',
          },
        },
        description: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: {
            values: ['pending', 'reviewed', 'dismissed'],
            message: 'Status must be pending, reviewed, or dismissed',
          },
          default: 'pending',
        },
      }],
      default: [],
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    // For admin moderation
    isHidden: {
      type: Boolean,
      default: false,
    },
    moderationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
reviewSchema.index({ job: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ recipient: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ type: 1 });
reviewSchema.index({ createdAt: -1 });

// Static method: Get average rating for a user
reviewSchema.statics.getAverageRating = async function (userId) {
  try {
    const result = await this.aggregate([
      {
        $match: { recipient: mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: '$recipient',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return result.length > 0
      ? {
          averageRating: Math.round(result[0].averageRating * 10) / 10,
          totalReviews: result[0].totalReviews,
        }
      : { averageRating: 0, totalReviews: 0 };
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return { averageRating: 0, totalReviews: 0 };
  }
};

export default mongoose.model('Review', reviewSchema);