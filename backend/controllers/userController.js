import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user with profile
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire');
    
    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found',
        { user: 'User not found' }
      );
    }

    // Get profile
    const profile = await Profile.findOne({ user: userId });

    return successResponse(
      res,
      200,
      'User profile retrieved successfully',
      {
        user,
        profile,
      }
    );
  } catch (error) {
    console.error('Get user profile error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found',
        { user: 'User not found' }
      );
    }

    const {
      name,
      location,
      // Freelancer fields
      skills,
      bio,
      hourlyRate,
      title,
      availability,
      portfolio,
      languages,
      // Client fields
      companyName,
      companyWebsite,
      industry,
      // Social links
      linkedin,
      github,
      twitter,
      website,
      // Profile fields
      phone,
      address,
      preferredJobTypes,
      preferredCategories,
      // Portfolio items
    
      // Certification items
      certifications,
      // Languages
      
      // Preferences
      emailNotifications,
      jobAlerts,
      visibility,
    } = req.body;

    // Update user fields
    if (name) user.name = name;
    if (location) user.location = location;

    // Update role-specific fields
    if (user.role === 'freelancer') {
      if (skills) user.skills = skills;
      if (bio) user.bio = bio;
      if (hourlyRate) user.hourlyRate = hourlyRate;
      if (title) user.title = title;
      if (availability) user.availability = availability;
    } else if (user.role === 'client') {
      if (companyName) user.companyName = companyName;
      if (companyWebsite) user.companyWebsite = companyWebsite;
      if (industry) user.industry = industry;
    }

    // Update social links
    if (linkedin || github || twitter || website) {
      user.socialLinks = {
        ...user.socialLinks,
        linkedin: linkedin || user.socialLinks?.linkedin,
        github: github || user.socialLinks?.github,
        twitter: twitter || user.socialLinks?.twitter,
        website: website || user.socialLinks?.website,
      };
    }

    // Save user changes
    await user.save();

    // Find or create profile
    let profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      profile = new Profile({
        user: userId,
      });
    }

    // Update profile fields
    if (phone || address) {
      profile.contactInfo = {
        ...profile.contactInfo,
        phone: phone || profile.contactInfo?.phone,
        address: address || profile.contactInfo?.address,
      };
    }

    if (preferredJobTypes) profile.preferredJobTypes = preferredJobTypes;
    if (preferredCategories) profile.preferredCategories = preferredCategories;

    // Update portfolio items if provided
    if (portfolio) {
      // Validate portfolio items
      if (!Array.isArray(portfolio)) {
        return errorResponse(
          res,
          400,
          'Portfolio must be an array',
          { portfolio: 'Portfolio must be an array of items' }
        );
      }

      profile.portfolio = portfolio;
    }

    // Update certifications if provided
    if (certifications) {
      // Validate certifications
      if (!Array.isArray(certifications)) {
        return errorResponse(
          res,
          400,
          'Certifications must be an array',
          { certifications: 'Certifications must be an array of items' }
        );
      }

      profile.certifications = certifications;
    }

    // Update languages if provided
    if (languages) {
      // Validate languages
      if (!Array.isArray(languages)) {
        return errorResponse(
          res,
          400,
          'Languages must be an array',
          { languages: 'Languages must be an array of items' }
        );
      }

      profile.languages = languages;
    }

    // Update preferences
    if (emailNotifications !== undefined || jobAlerts !== undefined || visibility) {
      profile.preferences = {
        ...profile.preferences,
        emailNotifications: emailNotifications ?? profile.preferences?.emailNotifications,
        jobAlerts: jobAlerts ?? profile.preferences?.jobAlerts,
        visibility: visibility || profile.preferences?.visibility,
      };
    }

    // Update last active timestamp
    profile.activityMetrics = {
      ...profile.activityMetrics,
      lastActive: Date.now(),
    };

    // Save profile changes
    await profile.save();

    return successResponse(
      res,
      200,
      'Profile updated successfully',
      {
        user,
        profile,
      }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Change user role
 * @route   PUT /api/users/change-role
 * @access  Private
 */
export const changeUserRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.body;

    // Validate role
    if (!role || !['freelancer', 'client'].includes(role)) {
      return errorResponse(
        res,
        400,
        'Invalid role',
        { role: 'Role must be freelancer or client' }
      );
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found',
        { user: 'User not found' }
      );
    }

    // Check if role is different
    if (user.role === role) {
      return errorResponse(
        res,
        400,
        'Already have this role',
        { role: `You are already a ${role}` }
      );
    }

    // Update role
    user.role = role;
    await user.save();

    return successResponse(
      res,
      200,
      `Role changed to ${role} successfully`,
      { user }
    );
  } catch (error) {
    console.error('Change role error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Deactivate user account
 * @route   PUT /api/users/deactivate
 * @access  Private
 */
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Validate password
    if (!password) {
      return errorResponse(
        res,
        400,
        'Password is required',
        { password: 'Please provide your password to confirm deactivation' }
      );
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found',
        { user: 'User not found' }
      );
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        'Invalid password',
        { password: 'Incorrect password' }
      );
    }

    // Deactivate account
    user.isActive = false;
    await user.save();

    return successResponse(
      res,
      200,
      'Account deactivated successfully',
      {}
    );
  } catch (error) {
    console.error('Deactivate account error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Get freelancers list
 * @route   GET /api/users/freelancers
 * @access  Public
 */
export const getFreelancers = async (req, res) => {
  try {
    const {
      skills,
      availability,
      rating,
      hourlyRate,
      location,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = { role: 'freelancer', isActive: true };

    // Add filters if provided
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    if (availability) {
      query.availability = availability;
    }

    if (hourlyRate) {
      const [min, max] = hourlyRate.split('-');
      query.hourlyRate = {};
      if (min) query.hourlyRate.$gte = parseInt(min);
      if (max) query.hourlyRate.$lte = parseInt(max);
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const freelancers = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await User.countDocuments(query);

    return successResponse(
      res,
      200,
      'Freelancers retrieved successfully',
      {
        freelancers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
        },
      }
    );
  } catch (error) {
    console.error('Get freelancers error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Get clients list
 * @route   GET /api/users/clients
 * @access  Private/Admin
 */
export const getClients = async (req, res) => {
  try {
    const {
      industry,
      location,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = { role: 'client', isActive: true };

    // Add filters if provided
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const clients = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await User.countDocuments(query);

    return successResponse(
      res,
      200,
      'Clients retrieved successfully',
      {
        clients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
        },
      }
    );
  } catch (error) {
    console.error('Get clients error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};