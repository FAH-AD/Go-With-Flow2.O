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
  title: user.title,
  bio: user.bio,
  hourlyRate: user.hourlyRate,
  completedJobs: user.completedJobs,
  successRate: user.successRate,
  totalEarnings: user.totalEarnings,
  portfolio: user.portfolio,
  experience: user.experience,
  education: user.education,
  completedJobs:user.completedJobs,
  totalEarnings:user.totalEarnings,
  successScore:user.successRate,
});

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
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
    return errorResponse(res, 500, 'Error fetching user profile');
  }
};

/**
 * @desc    Update user profile by ID
 * @route   PUT /api/users/:id/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    console.log(req.body, "req.body in update user profile");

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Check if the authenticated user has permission to edit this profile
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'You do not have permission to edit this profile');
    }

    // Common fields for both roles
    const commonFields = ['name', 'profilePic', 'skills', 'hourlyRate', 'portfolio', 'availability', 'languages','experience', 'education',]
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
      const freelancerFields = ['portfolio','title','bio', 'experience', 'education','hourlyRate',  'availability', 'languages',];
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
    console.log(updatedProfile ,"updated profile in update user profile");
    return successResponse(res, 200, 'User profile updated successfully', { user: updatedProfile });
  } catch (error) {
    console.error('Update user profile error:', error);
    return errorResponse(res, 500, 'Error updating user profile', { error: error.message });
  }
};