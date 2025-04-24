import express from 'express';
import {
  createEscrowPayment,
  releasePayment,
  getClientPayments,
  getFreelancerPayments,
  getPaymentById,
  refundPayment,
  getPaymentStats,
  getFreelancerPaymentStatus
} from '../controllers/paymentController.js';
import { protect, authorize, isVerified } from '../middleware/auth.js';
import { isClient, isFreelancer } from '../middleware/admin.js';

const router = express.Router();

// All routes are protected
router.post('/escrow', protect, isVerified, isClient, createEscrowPayment);
router.put('/:id/release', protect, isVerified, isClient, releasePayment);
router.get('/client', protect, isVerified, isClient, getClientPayments);
router.get('/freelancer', protect, isVerified, isFreelancer, getFreelancerPayments);
router.get('/stats', protect, authorize('admin'), getPaymentStats);
router.get('/:id', protect, isVerified, getPaymentById);
router.put('/:id/refund', protect, authorize('admin'), refundPayment);
router.get('/freelancer/status', protect, isVerified, isFreelancer, getFreelancerPaymentStatus);

export default router;
