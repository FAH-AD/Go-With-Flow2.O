import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Helper function to get common user fields
const getCommonUserFields = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  isActive: user.isActive,
  profilePic: user.profilePic,
  skills: user.skills,
  availability: user.availability,
  languages: user.languages,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Helper function to get client-specific fields
const getClientFields = (user) => ({
  companyName: user.companyName,
  companyWebsite: user.companyWebsite,
  industry: user.industry,
  isCompanyEmailVerified: user.isCompanyEmailVerified,
  totalSpent: user.totalSpent,
  hires: user.hires,
  clientVerification: user.clientVerification,
});

// Helper function to get freelancer-specific fields
const getFreelancerFields = (user) => ({
  completedJobs: user.completedJobs,
  successRate: user.successRate,
  totalEarnings: user.totalEarnings,
  portfolio: user.portfolio,
  experience: user.experience,
  education: user.education,
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    
    if (!req.user || !req.user.id) {
      return errorResponse(res,401, 'User not authenticated' );
    }
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res,404, 'User not found' );
    }

    const commonFields = getCommonUserFields(user);
    const roleSpecificFields = user.role === 'client' ? getClientFields(user) : getFreelancerFields(user);

    const userProfile = {
      ...commonFields,
      ...roleSpecificFields,
      payments: user.payments,
    };

    return successResponse(res, 200, 'User profile retrieved successfully', { user: userProfile });
  } catch (error) {
    console.error('Get user profile error:', error);
    return errorResponse(res,  500,'Error fetching user profile');
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Common fields for both roles
    const commonFields = ['name', 'profilePic', 'skills', 'availability', 'languages'];
    commonFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Role-specific fields
    if (user.role === 'client') {
      const clientFields = ['companyName', 'companyWebsite', 'industry'];
      clientFields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });
    } else if (user.role === 'freelancer') {
      const freelancerFields = ['portfolio', 'experience', 'education'];
      freelancerFields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });
    }

    await user.save();

    const updatedProfile = user.role === 'client' 
      ? { ...getCommonUserFields(user), ...getClientFields(user) }
      : { ...getCommonUserFields(user), ...getFreelancerFields(user) };

    return successResponse(res, 200, 'User profile updated successfully', { user: updatedProfile });
  } catch (error) {
    console.error('Update user profile error:', error);
    return errorResponse(res, 500, 'Error updating user profile', { error: error.message });
  }
};