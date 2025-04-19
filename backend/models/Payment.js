import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    bid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
      required: [true, 'Bid is required'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client is required'],
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Freelancer is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [5, 'Amount must be at least $5'],
    },
    serviceFee: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [5, 'Total amount must be at least $5'],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['credit-card', 'paypal', 'bank-transfer', 'other'],
        message: 'Payment method must be a valid option',
      },
      default: 'credit-card',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed', 'refunded', 'escrow', 'released'],
        message: 'Status must be a valid option',
      },
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    transferId: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentDate: {
      type: Date,
    },
    releaseDate: {
      type: Date,
    },
    refundDate: {
      type: Date,
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    isDisputed: {
      type: Boolean,
      default: false,
    },
    dispute: {
      type: {
        reason: {
          type: String,
          enum: {
            values: [
              'work-not-delivered',
              'quality-issues',
              'communication-issues',
              'scope-changes',
              'other',
            ],
            message: 'Reason must be a valid option',
          },
        },
        description: {
          type: String,
          trim: true,
        },
        initiatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: {
            values: ['pending', 'resolved', 'cancelled'],
            message: 'Status must be a valid option',
          },
          default: 'pending',
        },
        resolution: {
          type: String,
          enum: {
            values: [
              'in-favor-of-client',
              'in-favor-of-freelancer',
              'partial-refund',
              'no-refund',
            ],
            message: 'Resolution must be a valid option',
          },
        },
        resolutionDetails: {
          type: String,
          trim: true,
        },
        resolvedAt: {
          type: Date,
        },
        evidence: {
          type: [String],
          default: [],
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
paymentSchema.index({ job: 1 });
paymentSchema.index({ bid: 1 });
paymentSchema.index({ client: 1 });
paymentSchema.index({ freelancer: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);