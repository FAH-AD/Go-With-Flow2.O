import Review from '../models/Review.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Create a review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res) => {
  try {
    const {
      jobId,
      toUserId,
      rating,
      content,
      communication,
      quality,
      expertise,
      deadlineAdherence,
      overallExperience,
      isPublic,
    } = req.body;
    
    // Validate job
    const job = await Job.findById(jobId);
    if (!job) {
      return errorResponse(res, 'Job not found', 404);
    }
    
    // Validate recipient user
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return errorResponse(res, 'Recipient user not found', 404);
    }
    
    // Check if job is completed
    if (job.status !== 'completed') {
      return errorResponse(res, 'You can only review completed jobs', 400);
    }
    
    // Check if reviewer is either the client or the hired freelancer
    const isClient = job.client.toString() === req.user._id.toString();
    const isFreelancer = job.hiredFreelancer && job.hiredFreelancer.toString() === req.user._id.toString();
    
    if (!isClient && !isFreelancer) {
      return errorResponse(res, 'You must be either the client or the hired freelancer to submit a review', 403);
    }
    
    // Check that the review recipient is the correct role
    if (isClient && toUser._id.toString() !== job.hiredFreelancer.toString()) {
      return errorResponse(res, 'The review recipient must be the hired freelancer', 400);
    }
    
    if (isFreelancer && toUser._id.toString() !== job.client.toString()) {
      return errorResponse(res, 'The review recipient must be the client', 400);
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({
      job: jobId,
      from: req.user._id,
      to: toUserId,
    });
    
    if (existingReview) {
      return errorResponse(res, 'You have already submitted a review for this job', 400);
    }
    
    // Create new review
    const review = await Review.create({
      job: jobId,
      from: req.user._id,
      to: toUserId,
      rating: parseInt(rating),
      content,
      categories: {
        communication: parseInt(communication || rating),
        quality: parseInt(quality || rating),
        expertise: parseInt(expertise || rating),
        deadlineAdherence: parseInt(deadlineAdherence || rating),
        overallExperience: parseInt(overallExperience || rating),
      },
      isPublic: isPublic === undefined ? true : isPublic,
    });
    
    // Create notification for review recipient
    await Notification.create({
      recipient: toUserId,
      type: 'new_review',
      title: 'New Review Received',
      message: `You've received a ${rating}-star review for the job "${job.title}"`,
      data: {
        job: job._id,
        sender: req.user._id,
        review: review._id,
      },
    });
    
    return successResponse(res, {
      review,
      message: 'Review submitted successfully',
    }, 201);
  } catch (error) {
    console.error('Create review error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get reviews for a user
 * @route   GET /api/reviews/user/:userId
 * @access  Public
 */
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    // Build query - only public reviews unless viewing your own
    const query = { to: userId };
    
    if (!req.user || req.user._id.toString() !== userId) {
      query.isPublic = true;
    }
    
    // Count total reviews
    const totalReviews = await Review.countDocuments(query);
    
    // Get reviews
    const reviews = await Review.find(query)
      .populate('from', 'firstName lastName profileImage')
      .populate('job', 'title')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get review statistics
    const reviewStats = await Review.getReviewStats(userId);
    
    return successResponse(res, {
      reviews,
      stats: reviewStats,
      page,
      limit,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get reviews for a job
 * @route   GET /api/reviews/job/:jobId
 * @access  Public
 */
export const getJobReviews = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return errorResponse(res, 'Job not found', 404);
    }
    
    // Get client and freelancer review
    const clientReview = await Review.findOne({
      job: jobId,
      from: job.client,
    }).populate('from', 'firstName lastName profileImage role');
    
    const freelancerReview = await Review.findOne({
      job: jobId,
      to: job.client,
    }).populate('from', 'firstName lastName profileImage role');
    
    return successResponse(res, {
      clientReview,
      freelancerReview,
    });
  } catch (error) {
    console.error('Get job reviews error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }
    
    // Check if user is the review author
    if (review.from.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'You can only update your own reviews', 403);
    }
    
    // Check if review is less than 30 days old
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (review.createdAt < thirtyDaysAgo) {
      return errorResponse(res, 'Reviews can only be updated within 30 days of creation', 400);
    }
    
    // Update review fields
    const {
      rating,
      content,
      communication,
      quality,
      expertise,
      deadlineAdherence,
      overallExperience,
      isPublic,
    } = req.body;
    
    if (rating) review.rating = parseInt(rating);
    if (content) review.content = content;
    if (communication) review.categories.communication = parseInt(communication);
    if (quality) review.categories.quality = parseInt(quality);
    if (expertise) review.categories.expertise = parseInt(expertise);
    if (deadlineAdherence) review.categories.deadlineAdherence = parseInt(deadlineAdherence);
    if (overallExperience) review.categories.overallExperience = parseInt(overallExperience);
    if (isPublic !== undefined) review.isPublic = isPublic;
    
    await review.save();
    
    // Create notification for review recipient
    await Notification.create({
      recipient: review.to,
      type: 'new_review',
      title: 'Review Updated',
      message: `A review you received has been updated`,
      data: {
        job: review.job,
        sender: req.user._id,
        review: review._id,
      },
    });
    
    return successResponse(res, {
      review,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Update review error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }
    
    // Check if user is the review author or an admin
    if (review.from.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'You can only delete your own reviews', 403);
    }
    
    await review.remove();
    
    return successResponse(res, {
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Report a review
 * @route   POST /api/reviews/:id/report
 * @access  Private
 */
export const reportReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { reason } = req.body;
    
    if (!reason) {
      return errorResponse(res, 'Report reason is required', 400);
    }
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }
    
    // Check if the reporter is the review recipient
    if (review.to.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'You can only report reviews about yourself', 403);
    }
    
    // Update review with report information
    review.reported = {
      isReported: true,
      reason,
      reportedBy: req.user._id,
      reportedAt: new Date(),
    };
    
    await review.save();
    
    // Notify admins (through a notification to a dummy admin account or other mechanism)
    // This is placeholder logic; in a real system, you might have a way to notify all admins
    const adminUsers = await User.find({ role: 'admin' });
    
    for (const admin of adminUsers) {
      await Notification.create({
        recipient: admin._id,
        type: 'system_notification',
        title: 'Review Reported',
        message: `A review has been reported for violation. Reason: ${reason}`,
        data: {
          review: review._id,
          sender: req.user._id,
        },
      });
    }
    
    return successResponse(res, {
      message: 'Review reported successfully. Our team will review it shortly.',
    });
  } catch (error) {
    console.error('Report review error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Mark a review as helpful
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
export const markReviewAsHelpful = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }
    
    // Check if user has already marked this review as helpful
    const alreadyMarked = review.isHelpful.some(
      item => item.user.toString() === req.user._id.toString()
    );
    
    if (alreadyMarked) {
      // Remove the helpful mark
      review.isHelpful = review.isHelpful.filter(
        item => item.user.toString() !== req.user._id.toString()
      );
      
      await review.save();
      
      return successResponse(res, {
        message: 'Removed helpful mark from review',
        helpfulCount: review.isHelpful.length,
      });
    } else {
      // Add the helpful mark
      review.isHelpful.push({ user: req.user._id });
      
      await review.save();
      
      return successResponse(res, {
        message: 'Marked review as helpful',
        helpfulCount: review.isHelpful.length,
      });
    }
  } catch (error) {
    console.error('Mark review as helpful error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get reported reviews
 * @route   GET /api/reviews/reported
 * @access  Private/Admin
 */
export const getReportedReviews = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to access reported reviews', 403);
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get only reported reviews
    const query = { 'reported.isReported': true };
    
    // Count total reported reviews
    const totalReported = await Review.countDocuments(query);
    
    // Get reported reviews
    const reportedReviews = await Review.find(query)
      .populate('from', 'firstName lastName profileImage')
      .populate('to', 'firstName lastName profileImage')
      .populate('job', 'title')
      .populate('reported.reportedBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ 'reported.reportedAt': -1 });
    
    return successResponse(res, {
      reportedReviews,
      page,
      limit,
      totalReported,
      totalPages: Math.ceil(totalReported / limit),
    });
  } catch (error) {
    console.error('Get reported reviews error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get review statistics
 * @route   GET /api/reviews/stats
 * @access  Private/Admin
 */
export const getReviewStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to access review statistics', 403);
    }
    
    // Overall review count
    const totalReviews = await Review.countDocuments();
    
    // Average rating
    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          fiveStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] },
          },
          fourStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] },
          },
          threeStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] },
          },
          twoStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] },
          },
          oneStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] },
          },
        },
      },
    ]);
    
    // Category averages
    const categoryStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          communication: { $avg: '$categories.communication' },
          quality: { $avg: '$categories.quality' },
          expertise: { $avg: '$categories.expertise' },
          deadlineAdherence: { $avg: '$categories.deadlineAdherence' },
          overallExperience: { $avg: '$categories.overallExperience' },
        },
      },
    ]);
    
    // Monthly review counts for the current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Review.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    
    // Format monthly stats to include all months
    const formattedMonthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthData = monthlyStats.find(stat => stat._id === month);
      
      return {
        month,
        count: monthData ? monthData.count : 0,
        averageRating: monthData ? monthData.averageRating : 0,
      };
    });
    
    return successResponse(res, {
      totalReviews,
      averageRating: ratingStats.length > 0 ? ratingStats[0].averageRating : 0,
      starCounts: ratingStats.length > 0 ? {
        oneStar: ratingStats[0].oneStarCount,
        twoStar: ratingStats[0].twoStarCount,
        threeStar: ratingStats[0].threeStarCount,
        fourStar: ratingStats[0].fourStarCount,
        fiveStar: ratingStats[0].fiveStarCount,
      } : {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
      },
      categoryAverages: categoryStats.length > 0 ? {
        communication: categoryStats[0].communication,
        quality: categoryStats[0].quality,
        expertise: categoryStats[0].expertise,
        deadlineAdherence: categoryStats[0].deadlineAdherence,
        overallExperience: categoryStats[0].overallExperience,
      } : {
        communication: 0,
        quality: 0,
        expertise: 0,
        deadlineAdherence: 0,
        overallExperience: 0,
      },
      monthlyStats: formattedMonthlyStats,
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    return errorResponse(res, error.message, 500);
  }
};
