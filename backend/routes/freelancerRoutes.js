import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  respondToJobOffer,
  respondToTeamOffer,
  getPendingOffers
} from '../controllers/freelancerController.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('freelancer'));

router.post('/jobs/:jobId/offer/:offerId/respond', respondToJobOffer);
router.post('/jobs/:jobId/team-offer/:offerId/respond', respondToTeamOffer);

// Get all pending offers for the freelancer
router.get('/offers/pending', getPendingOffers);

export default router;