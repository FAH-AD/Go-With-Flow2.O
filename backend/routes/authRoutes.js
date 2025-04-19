import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getCurrentUser,
  updatePassword,
  resendVerification,
  sendCompanyEmailVerification,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/update-password', protect, updatePassword);
router.post('/verify-company-email', protect, sendCompanyEmailVerification);

export default router;