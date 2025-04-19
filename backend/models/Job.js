import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client is required'],
    },
   
    subCategory: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'Skills are required'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [5, 'Budget must be at least $5'],
    },
    deadline: {
      type: Date,
    },
    duration: {
      type: String,
      enum: {
        values: ['less-than-1-month', '1-3-months', '3-6-months', 'more-than-6-months'],
        message: 'Duration must be a valid option',
      },
    },
    experienceLevel: {
      type: String,
      enum: {
        values: ['entry', 'intermediate', 'expert'],
        message: 'Experience level must be entry, intermediate, or expert',
      },
      required: [true, 'Experience level is required'],
    },
    location: {
      type: String,
      enum: {
        values: ['remote', 'on-site', 'hybrid'],
        message: 'Location must be remote, on-site, or hybrid',
      },
      default: 'remote',
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in-progress', 'completed', 'cancelled'],
        message: 'Status must be open, in-progress, completed, or cancelled',
      },
      default: 'open',
    },
    attachments: {
      type: [String],
      default: [],
    },
    bidCount: {
      type: Number,
      default: 0,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    hiredFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    hiredBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
    },
    completionDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['none', 'escrow', 'released', 'refunded'],
        message: 'Payment status must be none, escrow, released, or refunded',
      },
      default: 'none',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    invitedFreelancers: {
      type: [
        {
          freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          status: {
            type: String,
            enum: {
              values: ['pending', 'accepted', 'declined'],
              message: 'Status must be pending, accepted, or declined',
            },
            default: 'pending',
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ client: 1 });

jobSchema.index({ status: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual field for bids
jobSchema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'job',
  justOne: false,
  options: { sort: { createdAt: -1 } },
});

export default mongoose.model('Job', jobSchema);