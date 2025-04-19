import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Portfolio title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Portfolio description is required'],
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required for portfolio'],
  }],
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
  },
});

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Language name is required'],
    trim: true,
  },
  level: {
    type: String,
    required: [true, 'Language level is required'],
    enum: ['beginner', 'fluent', 'bilingual'],
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['freelancer', 'client', 'admin'],
        message: 'Role must be freelancer, client, or admin',
      },
      required: [true, 'Role is required'],
      default: 'client',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordCode: String,
    resetPasswordExpire: Date,
    resetPasswordToken: String,
    
    // Fields for both freelancers and clients
    location: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '/uploads/default-avatar.png',
    },
    
    // Freelancer specific fields
    portfolio: [portfolioSchema],
    languages: [languageSchema],
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate cannot be negative'],
    },
    title: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      enum: {
        values: ['full-time', 'part-time', 'contract', 'not-available'],
        message: 'Availability must be full-time, part-time, contract, or not-available',
      },
      default: 'full-time',
    },
    experience: {
      type: [
        {
          companyName: String,
          position: String,
          startDate: Date,
          endDate: Date,
          current: {
            type: Boolean,
            default: false,
          },
          description: String,
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startDate: Date,
          endDate: Date,
          current: {
            type: Boolean,
            default: false,
          },
          description: String,
        },
      ],
      default: [],
    },
    
    // Client specific fields
    companyName: {
      type: String,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    isCompanyEmailVerified: {
      type: Boolean,
      default: false,
    },
    companyEmailVerificationToken: String,
    companyEmailVerificationExpire: Date,
    
    // Statistics and metrics
    completedJobs: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Social links
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for average rating
userSchema.virtual('rating', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'recipient',
  justOne: false,
  options: { sort: { createdAt: -1 } },
});

// Middleware: Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method: Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method: Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire time (24 hours)
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

// Method: Generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Method: Generate company email verification token
userSchema.methods.generateCompanyEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to companyEmailVerificationToken field
  this.companyEmailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire time (24 hours)
  this.companyEmailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

export default mongoose.model('User', userSchema);