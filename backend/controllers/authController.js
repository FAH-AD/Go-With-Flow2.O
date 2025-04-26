import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';



export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
     profilePic,
      skills,
      bio,
      hourlyRate,
      title,
      availability,
      portfolio,
      languages,
      experience,
      education,
      companyName,
      companyWebsite,
      companyDescription,
      industry,
      socialLinks,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    console.log('Received registration data:', req.body);

    if (userExists) {
      return errorResponse(
        res,
        400,
        'User already exists',
        { email: 'An account with this email address already exists' }
      );
    }

    // Validate required fields
    if (!name || !email || !password || !role) {
      return errorResponse(
        res,
        400,
        'Please provide all required fields',
        {
          name: !name ? 'Name is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
          role: !role ? 'Role is required' : undefined,
        }
      );
    }

    // Create user object with common fields
    const userFields = {
      name,
      email,
      password,
      role,
      location,
      profilePic,
      socialLinks,
    };

    // Add role-specific fields
    if (role === 'freelancer') {
      Object.assign(userFields, {
        skills,
        bio,
        hourlyRate,
        title,
        availability,
        portfolio,
        languages,
        experience,
        education,
      });
    } else if (role === 'client') {
      if (!companyName) {
        return errorResponse(
          res,
          400,
          'Company name is required for clients',
          { companyName: 'Company name is required' }
        );
      }
      Object.assign(userFields, {
        companyName,
        companyWebsite,
        companyDescription,
        industry,
      });
    } else {
      return errorResponse(
        res,
        400,
        'Invalid role',
        { role: 'Role must be either "freelancer" or "client"' }
      );
    }

    // Create user
    const user = await User.create(userFields);

    if (user) {
      // Generate email verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      // Create email message
      const message = `
        <h1>Verify Your Email</h1>
        <p>Your email verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>This code is valid for 10 minutes.</p>
      `;

      try {
        await sendEmail({
          to: user.email,
          subject: 'Email Verification Code',
          html: message,
        });

        return successResponse(
          res,
          201,
          'User registered successfully. Please check your email for the verification code.',
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          }
        );
      } catch (error) {
        console.error('Email sending error:', error);
        return successResponse(
          res,
          201,
          'User registered successfully, but there was an issue sending the verification code. Please use the resend verification option.',
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          }
        );
      }
    } else {
      return errorResponse(res, 400, 'Invalid user data');
    }
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(
      res,
      500,
      'An error occurred during registration',
      { server: error.message }
    );
  }
};



export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const message = `
    <h1>Verify Your Email</h1>
    <p>Your email verification code is:</p>
    <h2>${verificationCode}</h2>
    <p>This code is valid for 10 minutes.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Email Verification Code',
      html: message,
    });

    return successResponse(
      res,
      201,
      'User registered successfully. Please check your email for the verification code.',
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return successResponse(
      res,
      201,
      'User registered successfully, but there was an issue sending the verification code. Please use the resend verification option.',
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      }
    );
  }} catch (error) {
    console.error('Resend verification error:', error);
    return errorResponse(
      res,
      500,
      'An error occurred during resend verification',
      { server: error.message }
    );
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};


/**
 * @desc    User login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return errorResponse(
        res,
        400,
        'Please provide email and password',
        { 
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(
        res,
        401,
        'Invalid credentials',
        { auth: 'Invalid email or password' }
      );
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        'Invalid credentials',
        { auth: 'Invalid email or password' }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(
        res,
        401,
        'Account deactivated',
        { account: 'Your account has been deactivated' }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove sensitive data
    user.password = undefined;

    // Return user data with token
    return successResponse(
      res,
      200,
      'Login successful',
      {
        user,
        token,
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return errorResponse(
        res,
        400,
        'Please provide email',
        { email: 'Email is required' }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(
        res,
        404,
        'No user found with this email',
        { email: 'No account is associated with this email' }
      );
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save reset code and expiration to user
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpire = resetCodeExpire;

    await user.save();

    // Send reset email
    const message = `
      <h1>Reset Your Password</h1>
      <p>You requested a password reset. Here is your one-time reset code:</p>
      <h2>${resetCode}</h2>
      <p>This code is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Code',
        html: message,
      });

      return successResponse(
        res,
        200,
        'Password reset code sent to email',
        {}
      );
    } catch (error) {
      user.resetPasswordCode = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return errorResponse(
        res,
        500,
        'Email could not be sent',
        { email: 'Reset email could not be sent' }
      );
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    // Get token from params
    const { token } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password) {
      return errorResponse(
        res,
        400,
        'Please provide a new password',
        { password: 'New password is required' }
      );
    }

    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // Check if user exists
    if (!user) {
      return errorResponse(
        res,
        400,
        'Invalid or expired token',
        { token: 'Reset token is invalid or has expired' }
      );
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return successResponse(
      res,
      200,
      'Password reset successful. You can now log in with your new password.',
      {}
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found',
        { user: 'User not found' }
      );
    }

    return successResponse(
      res,
      200,
      'User retrieved successfully',
      { user }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate passwords
    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        400,
        'Please provide current password and new password',
        { 
          currentPassword: !currentPassword ? 'Current password is required' : undefined,
          newPassword: !newPassword ? 'New password is required' : undefined
        }
      );
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        'Current password is incorrect',
        { currentPassword: 'Current password is incorrect' }
      );
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    return successResponse(
      res,
      200,
      'Password updated successfully',
      {}
    );
  } catch (error) {
    console.error('Update password error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};



/**
 * @desc    Send company email verification
 * @route   POST /api/auth/verify-company-email
 * @access  Private
 */
export const sendCompanyEmailVerification = async (req, res) => {
  try {
    const { companyEmail } = req.body;
    const user = await User.findById(req.user.id);

    // Validate company email
    if (!companyEmail) {
      return errorResponse(
        res,
        400,
        'Please provide company email',
        { companyEmail: 'Company email is required' }
      );
    }

    // Check if user is client
    if (user.role !== 'client') {
      return errorResponse(
        res,
        400,
        'Only clients can verify company email',
        { role: 'Only clients can verify company email' }
      );
    }

    // Check if company name exists
    if (!user.companyName) {
      return errorResponse(
        res,
        400,
        'Company name is required',
        { companyName: 'Please update your profile with a company name first' }
      );
    }

    // Generate company email verification token
    const verificationToken = user.generateCompanyEmailVerificationToken();

    await user.save();

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-company-email/${verificationToken}`;
    
    const message = `
      <h1>Verify Your Company Email</h1>
      <p>Please verify your company email for ${user.companyName} by clicking the link below:</p>
      <a href="${verificationUrl}" target="_blank">Verify Company Email</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: companyEmail,
        subject: 'Company Email Verification',
        html: message,
      });

      return successResponse(
        res,
        200,
        'Company verification email sent',
        {}
      );
    } catch (error) {
      user.companyEmailVerificationToken = undefined;
      user.companyEmailVerificationExpire = undefined;
      await user.save();

      return errorResponse(
        res,
        500,
        'Email could not be sent',
        { email: 'Verification email could not be sent' }
      );
    }
  } catch (error) {
    console.error('Send company verification error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Validate input
    if (!email || !code || !newPassword) {
      return errorResponse(
        res,
        400,
        'Please provide email, reset code, and new password',
        { 
          email: !email ? 'Email is required' : undefined,
          code: !code ? 'Reset code is required' : undefined,
          newPassword: !newPassword ? 'New password is required' : undefined
        }
      );
    }

    // Find user by email
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // Check if user exists and code is valid
    if (!user) {
      return errorResponse(
        res,
        400,
        'Invalid or expired reset code',
        { code: 'Reset code is invalid or has expired' }
      );
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return successResponse(
      res,
      200,
      'Password reset successful. You can now log in with your new password.',
      {}
    );
  } catch (error) {
    console.error('Verify reset code error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

export const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Validate input
    if (!email || !code) {
      return errorResponse(
        res,
        400,
        'Please provide email and verification code',
        { 
          email: !email ? 'Email is required' : undefined,
          code: !code ? 'Verification code is required' : undefined
        }
      );
    }

    // Find user by email
    const user = await User.findOne({
      email,
      emailVerificationCode: code,
      emailVerificationExpire: { $gt: Date.now() },
    });

    // Check if user exists and code is valid
    if (!user) {
      return errorResponse(
        res,
        400,
        'Invalid or expired verification code',
        { code: 'Verification code is invalid or has expired' }
      );
    }

    // Set user as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    return successResponse(
      res,
      200,
      'Email verified successfully. You can now log in.',
      { token }
    );
  } catch (error) {
    console.error('Verify email code error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};