import express from 'express';
import {
  submitBid,
  getBidsByJob,
  getMyBids,
  getBidById,
  updateBid,
  withdrawBid,
  addBidFeedback
} from '../controllers/bidController.js';
import { protect, isVerified } from '../middleware/auth.js';
import { isFreelancer, isClient } from '../middleware/admin.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.post('/', protect, isVerified, isFreelancer, uploadMultiple('attachments', 3), submitBid);
router.get('/job/:jobId', protect, getBidsByJob);
router.get('/my-bids', protect, isFreelancer, getMyBids);
router.get('/:id', protect, getBidById);
router.put('/:id', protect, isFreelancer, uploadMultiple('attachments', 3), updateBid);
router.delete('/:id/withdraw', protect, isFreelancer, withdrawBid);
router.put('/:id/feedback', protect, isClient, addBidFeedback);

export default router;
