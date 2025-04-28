import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  respondToJobOffer,
  respondToTeamOffer,
  getPendingOffers,
  searchFreelancers
} from '../controllers/freelancerController.js';

const router = express.Router();

// Protect all routes


router.post('/jobs/:jobId/offer/:offerId/respond',protect,authorize('freelancer'), respondToJobOffer);
router.post('/jobs/:jobId/team-offer/:offerId/respond',protect,authorize('freelancer'), respondToTeamOffer);

// Get all pending offers for the freelancer
router.get('/offers/pending',protect,authorize('freelancer'), getPendingOffers);

// Search freelancers based on skills, location, and company name
router.get('/search', searchFreelancers);


export default router;