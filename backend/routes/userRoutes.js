import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changeUserRole,
  deactivateAccount,
  getFreelancers,
  getClients
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/freelancers', getFreelancers);

// Protected routes
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-role', protect, changeUserRole);
router.put('/deactivate', protect, deactivateAccount);

// Admin routes
router.get('/clients', protect, isAdmin, getClients);

export default router;