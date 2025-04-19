import mongoose from 'mongoose';

// Note: The Profile model is an extension of the User model
// It contains additional profile details that aren't essential to the core User schema
const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
    },
    // Portfolio items
    portfolio: [
      {
        title: {
          type: String,
          required: [true, 'Portfolio item title is required'],
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        images: {
          type: [String],
          default: [],
        },
        link: {
          type: String,
          trim: true,
        },
        category: {
          type: String,
          trim: true,
        },
        completionDate: {
          type: Date,
        },
        isPublic: {
          type: Boolean,
          default: true,
        },
      },
    ],
    // Additional contact information
    contactInfo: {
      phone: {
        type: String,
        trim: true,
      },
      address: {
        street: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        country: {
          type: String,
          trim: true,
        },
        zipCode: {
          type: String,
          trim: true,
        },
      },
      alternateEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    // Certifications and achievements
    certifications: [
      {
        name: {
          type: String,
          required: [true, 'Certification name is required'],
          trim: true,
        },
        issuingOrganization: {
          type: String,
          trim: true,
        },
        issueDate: {
          type: Date,
        },
        expiryDate: {
          type: Date,
        },
        credentialID: {
          type: String,
          trim: true,
        },
        credentialURL: {
          type: String,
          trim: true,
        },
      },
    ],
    // Languages
    languages: [
      {
        language: {
          type: String,
          required: [true, 'Language name is required'],
          trim: true,
        },
        proficiency: {
          type: String,
          enum: {
            values: ['basic', 'conversational', 'fluent', 'native'],
            message: 'Proficiency must be basic, conversational, fluent, or native',
          },
          default: 'conversational',
        },
      },
    ],
    // Preferences
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      jobAlerts: {
        type: Boolean,
        default: true,
      },
      visibility: {
        type: String,
        enum: {
          values: ['public', 'private', 'clients-only'],
          message: 'Visibility must be public, private, or clients-only',
        },
        default: 'public',
      },
    },
    // Preferred job types (freelancer specific)
    preferredJobTypes: {
      type: [String],
      default: [],
    },
    // Preferred categories (freelancer specific)
    preferredCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    // Saved/bookmarked items
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    savedFreelancers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Activity metrics
    activityMetrics: {
      lastActive: {
        type: Date,
        default: Date.now,
      },
      responseRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      responseTime: {
        type: Number, // Average response time in hours
        min: 0,
        default: 0,
      },
      jobCompletionRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
profileSchema.index({ user: 1 });
profileSchema.index({ 'preferredCategories': 1 });
profileSchema.index({ 'activityMetrics.lastActive': -1 });
profileSchema.index({ 'preferences.visibility': 1 });

export default mongoose.model('Profile', profileSchema);