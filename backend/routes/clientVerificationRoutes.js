import express from 'express';
import {
  requestClientVerification,
  verifyCompanyEmailCode,
} from '../controllers/clientVerificationController.js';
import { protect } from '../middleware/auth.js';
import {upload} from '../middleware/upload.js'; // Multer setup (with Cloudinary)

const router = express.Router();

// 📤 Route: Submit verification request (document or email)
router.post(
  '/verify',
  protect,
  upload.array('documents',5), // to handle multiple file uploads
  requestClientVerification
);

// 📥 Route: Confirm email verification via token
router.post('/verify/code', protect, verifyCompanyEmailCode);

export default router;
