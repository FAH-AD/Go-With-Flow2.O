import Bid from '../models/Bid.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { deleteFile } from '../middleware/upload.js';


/**
 * @desc    Submit a bid for a job
 * @route   POST /api/bids
 * @access  Private/Freelancer
 */
export const submitBid = async (req, res) => {
  // Validate required fields
  const {
    jobId,
    budget,
    deliveryTime,
    deliveryTimeUnit,
    proposal,
    attachments,
    milestones,
  } = req.body;


  // Step 1: Find the job
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  // Step 2: Check for existing bid
  const existingBid = await Bid.findOne({
    job: jobId,
    freelancer: req.user._id,
  });

  if (existingBid) {
    return res.status(400).json({
      success: false,
      message: 'You have already submitted a bid for this job',
    });
  }

  // Step 3: Create and save new bid
  const newBid = new Bid({
    job: jobId,
    freelancer: req.user._id,
    budget,
    deliveryTime,
    deliveryTimeUnit,
    proposal,
    attachments,
    milestones,
  });

  const savedBid = await newBid.save().catch(err => {
    console.warn('Error saving bid:', err);
    return null;
  });

  if (!savedBid) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save bid',
    });
  }

  // Step 4: Increment bid count without validating the whole job document
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $inc: { bidCount: 1 } },
    { new: true }
  ).catch(err => {
    console.warn('Error updating bid count:', err);
    return null;
  });

  if (!updatedJob) {
    return res.status(500).json({
      success: false,
      message: 'Bid submitted, but failed to update job bid count',
    });
  }

  // Success
  return res.status(200).json({
    success: true,
    message: 'Bid submitted successfully',
    bid: savedBid,
  });
};


/**
 * @desc    Get all bids for a job
 * @route   GET /api/bids/job/:jobId
 * @access  Private/Client
 */
export const getBidsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const bids = await Bid.find({ job: jobId }).populate('freelancer', 'name email');
    
    return successResponse(res, 200, 'Bids retrieved successfully', { bids });
  } catch (error) {
    console.error('Get bids by job error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};

/**
 * @desc    Get all bids by current freelancer
 * @route   GET /api/bids/my-bids
 * @access  Private/Freelancer
 */
export const getMyBids = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Status filter
    const status = req.query.status || '';
    
    // Build query
    const query = { freelancer: req.user._id };
    
    if (status && ['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      query.status = status;
    }
    
    // Count total bids
    const totalBids = await Bid.countDocuments(query);
    
    // Fetch bids
    const bids = await Bid.find(query)
      .populate({
        path: 'job',
        select: 'title budget status client',
        populate: {
          path: 'client',
          select: 'firstName lastName profileImage',
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return successResponse(res, {
      bids,
      page,
      limit,
      totalBids,
      totalPages: Math.ceil(totalBids / limit),
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get bid by ID
 * @route   GET /api/bids/:id
 * @access  Private
 */
export const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('freelancer', 'firstName lastName profileImage email')
      .populate({
        path: 'job',
        populate: {
          path: 'client',
          select: 'firstName lastName profileImage',
        },
      });
    
    if (!bid) {
      return errorResponse(res, 'Bid not found', 404);
    }
    
    // Check if user is the bid owner, job owner, or admin
    const isFreelancer = bid.freelancer._id.toString() === req.user._id.toString();
    const isClient = bid.job.client._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isFreelancer && !isClient && !isAdmin) {
      return errorResponse(res, 'Not authorized to view this bid', 403);
    }
    
    return successResponse(res, { bid });
  } catch (error) {
    console.error('Get bid by ID error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Update bid
 * @route   PUT /api/bids/:id
 * @access  Private/Freelancer
 */
export const updateBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return errorResponse(res, 'Bid not found', 404);
    }
    
    // Check if user is the bid owner
    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to update this bid', 403);
    }
    
    // Check if bid is still pending
    if (bid.status !== 'pending') {
      return errorResponse(res, `Cannot update bid with status ${bid.status}`, 400);
    }
    
    // Check if job is still open
    const job = await Job.findById(bid.job);
    if (!job || job.status !== 'open') {
      return errorResponse(res, 'Cannot update bid for a job that is not open', 400);
    }
    
    // Update bid fields
    const { budget, proposal, deliveryTime, milestones } = req.body;
    
    if (budget) bid.budget = parseFloat(budget);
    if (proposal) bid.proposal = proposal;
    if (deliveryTime) bid.deliveryTime = parseInt(deliveryTime);
    
    // Update milestones if provided
    if (milestones) {
      try {
        bid.milestones = typeof milestones === 'string' ? JSON.parse(milestones) : milestones;
      } catch (error) {
        return errorResponse(res, 'Invalid milestones format', 400);
      }
    }
    
    // Handle file attachments
    if (req.files && req.files.length > 0) {
      // Delete old attachments if specified
      if (req.body.deleteAttachments === 'true' || req.body.deleteAttachments === true) {
        bid.attachments.forEach(attachment => {
          deleteFile(attachment.path);
        });
        bid.attachments = [];
      }
      
      // Add new attachments
      const newAttachments = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        mimeType: file.mimetype,
      }));
      
      bid.attachments = [...bid.attachments, ...newAttachments];
    }
    
    // Save updated bid
    await bid.save();
    
    return successResponse(res, {
      bid,
      message: 'Bid updated successfully',
    });
  } catch (error) {
    console.error('Update bid error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Withdraw bid
 * @route   DELETE /api/bids/:id/withdraw
 * @access  Private/Freelancer
 */
export const withdrawBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return errorResponse(res, 'Bid not found', 404);
    }
    
    // Check if user is the bid owner
    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to withdraw this bid', 403);
    }
    
    // Check if bid is still pending
    if (bid.status !== 'pending') {
      return errorResponse(res, `Cannot withdraw bid with status ${bid.status}`, 400);
    }
    
    // Update bid status
    bid.status = 'withdrawn';
    await bid.save();
    
    // Remove bid from job
    await Job.findByIdAndUpdate(bid.job, {
      $pull: { bids: bid._id },
    });
    
    return successResponse(res, {
      message: 'Bid withdrawn successfully',
    });
  } catch (error) {
    console.error('Withdraw bid error:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Add client feedback to bid
 * @route   PUT /api/bids/:id/feedback
 * @access  Private/Client
 */
export const addBidFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    
    const bid = await Bid.findById(req.params.id).populate('job');
    
    if (!bid) {
      return errorResponse(res, 'Bid not found', 404);
    }
    
    // Check if user is the job owner
    if (bid.job.client.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to add feedback to this bid', 403);
    }
    
    // Add feedback
    bid.clientFeedback = feedback;
    await bid.save();
    
    // Create notification for freelancer
    await Notification.create({
      recipient: bid.freelancer,
      type: 'system_notification',
      title: 'New Feedback on Your Bid',
      message: `The client has provided feedback on your bid for "${bid.job.title}"`,
      data: {
        job: bid.job._id,
        sender: req.user._id,
        bid: bid._id,
      },
    });
    
    return successResponse(res, {
      message: 'Feedback added successfully',
    });
  } catch (error) {
    console.error('Add bid feedback error:', error);
    return errorResponse(res, error.message, 500);
  }
};


