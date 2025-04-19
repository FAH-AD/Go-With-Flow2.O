import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  changeUserRole,
  handleReportedReview,
  createSystemNotification,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllJobs,
  getAllPayments
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard and statistics
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);
router.put('/users/:userId/role', changeUserRole);

// Review management
router.put('/reviews/:reviewId/report', handleReportedReview);

// Notification management
router.post('/notifications', createSystemNotification);

// Category management
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Job administration
router.get('/jobs', getAllJobs);

// Payment administration
router.get('/payments', getAllPayments);

export default router;
