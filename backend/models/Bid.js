import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Freelancer is required'],
    },
    budget: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [5, 'Bid amount must be at least $5'],
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Delivery time is required'],
      min: [1, 'Delivery time must be at least 1 day'],
    },
    deliveryTimeUnit: {
      type: String,
      enum: {
        values: ['days', 'weeks', 'months'],
        message: 'Delivery time unit must be days, weeks, or months',
      },
      default: 'days',
    },
    proposal: {
      type: String,
      required: [true, 'Proposal is required'],
      trim: true,
      minlength: [50, 'Proposal must be at least 50 characters'],
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'accepted',
          'rejected',
          'withdrawn',
          'completed',
          'cancelled',
        ],
        message: 'Status must be a valid option',
      },
      default: 'pending',
    },
    clientFeedback: {
      type: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    milestones: {
      type: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },
          description: {
            type: String,
            trim: true,
          },
          amount: {
            type: Number,
            required: true,
            min: [5, 'Milestone amount must be at least $5'],
          },
          dueDate: {
            type: Date,
          },
          status: {
            type: String,
            enum: {
              values: ['pending', 'in-progress', 'completed', 'paid', 'disputed'],
              message: 'Status must be a valid option',
            },
            default: 'pending',
          },
          completedAt: {
            type: Date,
          },
          paidAt: {
            type: Date,
          },
        },
      ],
      default: [],
    },
    role: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
bidSchema.index({ job: 1, freelancer: 1 }, { unique: true });
bidSchema.index({ job: 1 });
bidSchema.index({ freelancer: 1 });
bidSchema.index({ status: 1 });
bidSchema.index({ amount: 1 });
bidSchema.index({ createdAt: -1 });

export default mongoose.model('Bid', bidSchema);