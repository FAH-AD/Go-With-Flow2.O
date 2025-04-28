import express from 'express';
import {
  submitBid,
  getBidsByJob,
  getMyBids,
  getBidById,
  updateBid,
  withdrawBid,
  addBidFeedback,
  getBidStats,
  getFreelancerBidForJob
} from '../controllers/bidController.js';
import { protect, authorize } from '../middleware/auth.js';
import { isFreelancer, isClient } from '../middleware/admin.js';
import { upload} from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.post('/', protect, authorize('freelancer'), upload.array( 3), submitBid);
router.get('/job/:jobId/my-bid', protect, authorize('freelancer'), getFreelancerBidForJob);
router.get('/job/:jobId', protect, getBidsByJob);
router.get('/my-bids', protect, authorize('freelancer'), getMyBids);
router.get('/:id', protect, getBidById);
router.put('/:id', protect, authorize('freelancer'), upload.array(3), updateBid);
router.delete('/:id/withdraw', protect, authorize('freelancer'), withdrawBid);
router.put('/:id/feedback', protect, authorize('client'), addBidFeedback);
router.get('/stats/:jobId', protect, getBidStats);

export default router;
