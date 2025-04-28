import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUserProfile, updateUserProfile } from '../controllers/userProfileController.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);
export default router;