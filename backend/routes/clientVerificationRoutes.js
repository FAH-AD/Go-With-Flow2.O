import express from 'express';
import {
  requestClientVerification,
  verifyCompanyEmailCode,
} from '../controllers/clientVerificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 📤 Route: Submit verification request (document or email)
router.post(
  '/verify',
  protect,
  requestClientVerification
);

// 📥 Route: Confirm email verification via token
router.post('/verify/code', protect, verifyCompanyEmailCode);

export default router;
