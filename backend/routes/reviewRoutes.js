import express from 'express';
import {
  createReview,
  getUserReviews,
  getJobReviews,
  updateReview,
  deleteReview,
  reportReview,
  markReviewAsHelpful,
  getReportedReviews,
  getReviewStats
} from '../controllers/reviewController.js';
import { protect, authorize, isVerified } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/user/:userId', getUserReviews);
router.get('/job/:jobId', getJobReviews);

// Protected routes
router.post('/', protect, isVerified, createReview);
router.put('/:id', protect, isVerified, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/report', protect, isVerified, reportReview);
router.post('/:id/helpful', protect, isVerified, markReviewAsHelpful);

// Admin routes
router.get('/reported', protect, authorize('admin'), getReportedReviews);
router.get('/stats', protect, authorize('admin'), getReviewStats);

export default router;
