import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyPostedJobs,
  hireFreelancer,
  completeJob,
  cancelJob,
  getClientActiveAndCompletedJobs,
  getFreelancerActiveAndCompletedJobs } 
  from '../controllers/jobController.js';
import { protect, authorize, isVerified } from '../middleware/auth.js';
import { isClient, isClientOrAdmin, isFreelancer } from '../middleware/admin.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', protect, isVerified, isClient, uploadMultiple('attachments', 5), createJob);
router.put('/:id', protect, isVerified, isClient, uploadMultiple('attachments', 5), updateJob);
router.delete('/:id', protect, isClientOrAdmin, deleteJob);

// Client routes
router.get('/my/posted-jobs', protect, isClient, getMyPostedJobs);
router.post('/:id/hire/:bidId', protect, isClient, hireFreelancer);
router.put('/:id/complete', protect, isClient, completeJob);
router.put('/:id/cancel', protect, isClientOrAdmin, cancelJob);
router.get('/client/status',protect, isClientOrAdmin, getClientActiveAndCompletedJobs);

//freelancer routes
router.get('/freelancer/status',protect, isFreelancer, getFreelancerActiveAndCompletedJobs);

export default router;
