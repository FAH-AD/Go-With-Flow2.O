import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUserProfile, updateUserProfile } from '../controllers/userProfileController.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;