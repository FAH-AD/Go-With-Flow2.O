import Payment from '../models/Payment.js';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Create a payment (escrow)
 * @route   POST /api/payments/escrow
 * @access  Private/Client
 */
export const createEscrowPayment = async (req, res) => {
  try {
    const { jobId, bidId, amount, description, milestoneId } = req.body;
    
    // Validate job and bid
    const job = await Job.findById(jobId);
    if (!job) {
      return errorResponse(res, 'Job not found', 404);
    }
    
    // Check if user is the job owner
    if (job.client.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized. You can only make payments for your own jobs.', 403);
    }
    
    // Check if job is in progress
    if (job.status !== 'in-progress') {
      return errorResponse(res, `Cannot make payment for job with status ${job.status}`, 400);
    }
    
    // Validate bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return errorResponse(res, 'Bid not found', 404);
    }
    
    if (bid.job.toString() !== job._id.toString()) {
      return errorResponse(res, 'Bid is not associated with this job', 400);
    }
    
    if (bid.status !== 'accepted') {
      return errorResponse(res, 'Bid must be accepted to make a payment', 400);
    }
    
    // Validate milestone if provided
    let milestone = null;
    if (milestoneId) {
      milestone = bid.milestones.id(milestoneId);
      if (!milestone) {
        return errorResponse(res, 'Milestone not found', 404);
      }
      
      if (milestone.status === 'approved') {
        return errorResponse(res, 'Payment already processed for this milestone', 400);
      }
    }
    
    // Calculate service fee (assume 5% platform fee)
    const parsedAmount = parseFloat(amount);
    const serviceFee = parsedAmount * 0.05;
    const totalAmount = parsedAmount + serviceFee;
    
    // Create payment record
    const payment = await Payment.create({
      job: jobId,
      bid: bidId,
      client: req.user._id,
      freelancer: bid.freelancer,
      amount: parsedAmount,
      serviceFee,
      totalAmount,
      description,
      milestone: milestoneId || null,
      paymentMethod: 'escrow',
      status: 'pending',
      paymentDate: new Date(),
      invoice: {
        issuedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        items: [
          {
            description: description || `Payment for job: ${job.title}`,
            quantity: 1,
            unitPrice: parsedAmount,
            total: parsedAmount,
          },
          {
            description: 'Service Fee (5%)',
            quantity: 1,
            unitPrice: serviceFee,
            total: serviceFee,
          },
        ],
      },
    });
    
    // Update milestone status if applicable
    if (milestone) {
      milestone.status = 'in-progress';
      await bid.save();
    }
    
    // Mark payment as verified for the job
    job.paymentVerified = true;
    await job.save();
    
    // Create notification for freelancer
    await Notification.create({
      recipient: bid.freelancer,
      type: 'payment_received',
      title: 'Payment Created',
      message: `A payment of ${parsedAmount.toFixed(2)} has been created for your work on "${job.title}"`,
      data: {
        job: job._id,
        sender: req.user._id,
        payment: payment._id,
      },
    });
    
    return successResponse(res, {
      payment,
      message: 'Payment created successfully and held in escrow',
    }, 201);
  } catch (error) {
    console.error('Create payment error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Release payment from escrow
 * @route   PUT /api/payments/:id/release
 * @access  Private/Client
 */
export const releasePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return errorResponse(res, 'Payment not found', 404);
    }
    
    // Check if user is the client who made the payment
    if (payment.client.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to release this payment', 403);
    }
    
    // Check if payment is in pending status
    if (payment.status !== 'pending') {
      return errorResponse(res, `Cannot release payment with status ${payment.status}`, 400);
    }
    
    // Update payment status
    payment.status = 'completed';
    payment.releaseDate = new Date();
    await payment.save();
    
    // If payment is for a milestone, update milestone status
    if (payment.milestone) {
      const bid = await Bid.findById(payment.bid);
      if (bid) {
        const milestone = bid.milestones.id(payment.milestone);
        if (milestone) {
          milestone.status = 'approved';
          await bid.save();
        }
      }
    }
    
    // Create notification for freelancer
    await Notification.create({
      recipient: payment.freelancer,
      type: 'payment_received',
      title: 'Payment Released',
      message: `A payment of ${payment.amount.toFixed(2)} has been released to you`,
      data: {
        job: payment.job,
        sender: req.user._id,
        payment: payment._id,
      },
    });
    
    return successResponse(res, {
      message: 'Payment released successfully',
    });
  } catch (error) {
    console.error('Release payment error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get all payments for a client
 * @route   GET /api/payments/client
 * @access  Private/Client
 */
export const getClientPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter options
    const status = req.query.status || '';
    
    // Build query
    const query = { client: req.user._id };
    
    if (status && ['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      query.status = status;
    }
    
    // Count total payments
    const totalPayments = await Payment.countDocuments(query);
    
    // Fetch payments
    const payments = await Payment.find(query)
      .populate('job', 'title')
      .populate('freelancer', 'firstName lastName profileImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return successResponse(res, {
      payments,
      page,
      limit,
      totalPayments,
      totalPages: Math.ceil(totalPayments / limit),
    });
  } catch (error) {
    console.error('Get client payments error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get all payments for a freelancer
 * @route   GET /api/payments/freelancer
 * @access  Private/Freelancer
 */
export const getFreelancerPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter options
    const status = req.query.status || '';
    
    // Build query
    const query = { freelancer: req.user._id };
    
    if (status && ['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      query.status = status;
    }
    
    // Count total payments
    const totalPayments = await Payment.countDocuments(query);
    
    // Fetch payments
    const payments = await Payment.find(query)
      .populate('job', 'title')
      .populate('client', 'firstName lastName profileImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return successResponse(res, {
      payments,
      page,
      limit,
      totalPayments,
      totalPages: Math.ceil(totalPayments / limit),
    });
  } catch (error) {
    console.error('Get freelancer payments error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('job', 'title client')
      .populate('client', 'firstName lastName profileImage email')
      .populate('freelancer', 'firstName lastName profileImage email')
      .populate('bid', 'amount deliveryTime');
    
    if (!payment) {
      return errorResponse(res, 'Payment not found', 404);
    }
    
    // Check if user is authorized to view this payment
    const isClient = payment.client._id.toString() === req.user._id.toString();
    const isFreelancer = payment.freelancer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isClient && !isFreelancer && !isAdmin) {
      return errorResponse(res, 'Not authorized to view this payment', 403);
    }
    
    return successResponse(res, { payment });
  } catch (error) {
    console.error('Get payment by ID error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Refund a payment
 * @route   PUT /api/payments/:id/refund
 * @access  Private/Admin
 */
export const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return errorResponse(res, 'Payment not found', 404);
    }
    
    // Only admin can refund payments
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to refund payments', 403);
    }
    
    // Check if payment can be refunded
    if (payment.status !== 'pending' && payment.status !== 'completed') {
      return errorResponse(res, `Cannot refund payment with status ${payment.status}`, 400);
    }
    
    // Update payment status
    payment.status = 'refunded';
    await payment.save();
    
    // Create notifications for both client and freelancer
    await Notification.create({
      recipient: payment.client,
      type: 'system_notification',
      title: 'Payment Refunded',
      message: `Your payment of ${payment.amount.toFixed(2)} has been refunded`,
      data: {
        payment: payment._id,
        sender: req.user._id,
      },
    });
    
    await Notification.create({
      recipient: payment.freelancer,
      type: 'system_notification',
      title: 'Payment Refunded',
      message: `A payment of ${payment.amount.toFixed(2)} has been refunded to the client`,
      data: {
        payment: payment._id,
        sender: req.user._id,
      },
    });
    
    return successResponse(res, {
      message: 'Payment refunded successfully',
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get payment statistics
 * @route   GET /api/payments/stats
 * @access  Private/Admin
 */
export const getPaymentStats = async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to access payment statistics', 403);
    }
    
    // Get overall stats
    const totalPayments = await Payment.countDocuments();
    const completedPayments = await Payment.countDocuments({ status: 'completed' });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const refundedPayments = await Payment.countDocuments({ status: 'refunded' });
    
    // Calculate total amounts
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalServiceFee: { $sum: '$serviceFee' },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
        },
      },
    ]);
    
    // Get monthly stats for the current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          amount: { $sum: '$amount' },
          serviceFee: { $sum: '$serviceFee' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    
    // Format monthly stats to include all months
    const formattedMonthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthData = monthlyStats.find(stat => stat._id === month);
      
      return {
        month,
        count: monthData ? monthData.count : 0,
        amount: monthData ? monthData.amount : 0,
        serviceFee: monthData ? monthData.serviceFee : 0,
      };
    });
    
    return successResponse(res, {
      totalPayments,
      completedPayments,
      pendingPayments,
      refundedPayments,
      totalAmount: paymentStats.length > 0 ? paymentStats[0].totalAmount : 0,
      totalServiceFee: paymentStats.length > 0 ? paymentStats[0].totalServiceFee : 0,
      completedAmount: paymentStats.length > 0 ? paymentStats[0].completedAmount : 0,
      pendingAmount: paymentStats.length > 0 ? paymentStats[0].pendingAmount : 0,
      monthlyStats: formattedMonthlyStats,
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    return errorResponse(res, error.message, 500);
  }
};

export const createMilestoneEscrowPayment = async (jobId, freelancerId, milestoneId, amount, clientId) => {
  try {
    // if (!amount || isNaN(amount)) {
    //   console.log('Invalid amount:', amount);
    //   throw new Error('Invalid amount');
    // }

    const serviceFeePercentage = 0.1; // 10% service fee
    const serviceFee = amount * serviceFeePercentage;
    const totalAmount = amount + serviceFee;

    const payment = new Payment({
      job: jobId,
      bid: milestoneId,
      client: clientId,
      freelancer: freelancerId,
      amount: amount,
      serviceFee: serviceFee,
      totalAmount: totalAmount,
      paymentMethod: 'credit-card',
      status: 'pending',
      description: 'Milestone payment',
      currency: 'USD',
      paymentDate: new Date(),
      milestone: milestoneId
    });

    await payment.save();

    // Update freelancer's payment status
    await User.findByIdAndUpdate(freelancerId, {
      $inc: { 'payments.inProgress': amount }
    });

    return payment;
  } catch (error) {
    console.error('Create milestone escrow payment error:', error);
    throw error;
  }
};
export const getFreelancerPaymentStatus = async (req, res) => {
  try {
    const freelancer = await User.findById(req.user._id);
    if (!freelancer) {
      return errorResponse(res, 'Freelancer not found', 404);
    }

    return successResponse(res, 200, {
      inProgress: freelancer.payments.inProgress,
      pending: freelancer.payments.pending,
      available: freelancer.payments.available
    });
  } catch (error) {
    console.error('Get freelancer payment status error:', error);
    return errorResponse(res, error.message, 500);
  }
};
