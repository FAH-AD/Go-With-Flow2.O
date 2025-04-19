import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import Bid from '../models/Bid.js';
import Notification from '../models/Notification.js';
import { customErrorHandler,successResponse } from '../utils/apiResponse.js';

import httpStatus from 'http-status';
import { getJobReviews } from './reviewController.js';

// Utility: send a unified response
const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: statusCode < 400 ? 'success' : 'error',
    message,
    data,
  });
};

// 1. Create Job
export const createJob = async (req, res, next) => {
  try {
    const jobData = { ...req.body, client: req.user.id };
    const job = await Job.create(jobData);
    sendResponse(res, httpStatus.CREATED, 'Job has been successfully posted.', job);
  } catch (error) {
    next(new ApiError(httpStatus.BAD_REQUEST, `Failed to post job: ${error.message}`));
  }
};

// 2. Get All Jobs
export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find();
    sendResponse(res, httpStatus.OK, 'All jobs retrieved successfully.', jobs);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to fetch jobs.'));
  }
};

// 3. Get Single Job
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError(httpStatus.NOT_FOUND, 'Job not found.'));
    sendResponse(res, httpStatus.OK, 'Job details retrieved successfully.', job);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not retrieve job.'));
  }
};

// 4. Get Jobs by Client
export const getMyPostedJobs = async (req, res, next) => {
  try {
    const clientId = req.user._id;

    const jobs = await Job.find({ client: clientId });

    if (!jobs || jobs.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'You have not posted any jobs yet.');
    }

    res.status(httpStatus.OK).json({
      status: 'success',
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};


// 5. Get Jobs by Freelancer
export const getJobsByFreelancer = async (req, res, next) => {
  try {
    const jobs = await Job.find({ hiredFreelancer: req.user.id });
    sendResponse(res, httpStatus.OK, 'Jobs you were hired for retrieved.', jobs);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to fetch freelancer jobs.'));
  }
};

// 6. Update Job
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, client: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) return next(new ApiError(httpStatus.NOT_FOUND, 'Job not found or unauthorized.'));
    sendResponse(res, httpStatus.OK, 'Job updated successfully.', job);
  } catch (error) {
    next(new ApiError(httpStatus.BAD_REQUEST, `Update failed: ${error.message}`));
  }
};

// 7. Delete Job
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, client: req.user.id });
    if (!job) return next(new ApiError(httpStatus.NOT_FOUND, 'No job found to delete.'));
    sendResponse(res, httpStatus.OK, 'Job removed successfully.', job);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not delete job.'));
  }
};

// 8. Hire Freelancer
export const hireFreelancer = async (req, res) => {
  try {
    const { id, bidId } = req.params;

    // Step 1: Get the job
    const job = await Job.findById(id);
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

   
    if (job.client.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: You can only hire for your own jobs',job.createdBy), 403);
    }

    // Step 3: Check if job is open
    if (job.status !== 'open') {
      return customErrorHandler(res, new Error(`Cannot hire for job with status ${job.status}`), 400);
    }

    // Step 4: Get and validate bid
    const bid = await Bid.findById(bidId);
    if (!bid) return customErrorHandler(res, new Error('Bid not found'), 404);
    if (bid.job.toString() !== job._id.toString()) {
      return customErrorHandler(res, new Error('Bid does not belong to this job'), 400);
    }

    await Bid.updateOne(
      { _id: bid._id },
      { status: 'accepted' }
    );
    
    // Step 3: Update job status and hired freelancer
    await Job.updateOne(
      { _id: job._id },
      {
        status: 'in-progress',
        hiredFreelancer: bid.freelancer
      }
    );

    // Step 6: Reject other bids
    await Bid.updateMany(
      { job: job._id, _id: { $ne: bid._id } },
      { status: 'rejected' }
    );

    // Step 7: Notify hired freelancer
    await Notification.create({
      recipient: bid.freelancer,
      type: 'bid-accepted',
      title: 'Bid Accepted',
      message: `Your bid on "${job.title}" has been accepted! You've been hired.`,
      data: {
        job: job._id,
        sender: req.user._id,
        bid: bid._id,
      },
    });

    return successResponse(res, 200, 'Freelancer hired successfully');

  } catch (error) {
    return customErrorHandler(res, error);
  }
};
/**
 * @desc    Complete a job
 * @route   PUT /api/jobs/:id/complete
 * @access  Private/Client
 */
export const completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return errorResponse(res, 'Job not found', 404);
    }
    
    // Check if user is the job owner
    if (job.client.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized. You can only complete your own jobs.', 403);
    }
    
    // Check if job is in progress
    if (job.status !== 'in-progress') {
      return errorResponse(res,  `Cannot complete job ${job.status}`, 400);
    }
    
    // Update job status
    job.status = 'completed';
    job.completionDate = new Date();
    await job.save();
    
    // Create notification for freelancer
    await Notification.create({
      recipient: job.hiredFreelancer,
      type: 'job_completed',
      title: 'Job Completed',
      message: `The job ${job.title} has been marked as completed by the client.`,
      data: {
        job: job._id,
        sender: req.user._id,
      },
    });
    
    return successResponse(res, 200, {
      message: 'Job marked as completed',
    });
  } catch (error) {
    console.error('Complete job error:', error);
    return errorResponse(res, error.message, 500);
  }
};


export const cancelJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return errorResponse(res, 'Job not found', 404);
    }
    
    // Check if user is the job owner or admin
    if (job.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized. You can only cancel your own jobs.', 403);
    }
    
    // Check if job is already completed
    if (job.status === 'completed') {
      return errorResponse(res, 'Cannot cancel a completed job', 400);
    }
    
    // Update job status
    job.status = 'cancelled';
    await job.save();
    
    // If a freelancer was hired, notify them
    if (job.hiredFreelancer) {
      await Notification.create({
        recipient: job.hiredFreelancer,
        type: 'job_cancelled',
        title: 'Job Cancelled',
        message: 'This job has been cancelled by the client.',
        data: {
          job: job._id,
          sender: req.user._id,
        },
      });
      
      // Update the accepted bid if exists
      await Bid.findOneAndUpdate(
        { job: job._id, status: 'accepted' },
        { status: 'rejected' }
      );
    }
    
    return successResponse(res,200, {
      message: 'Job cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel job error:', error);
    return errorResponse(res, error.message, 500);
  }
};

export const getClientActiveAndCompletedJobs = async (req, res, next) => {
  try {
    const clientId = req.user._id;

    const jobs = await Job.find({
      client: clientId,
      status: { $in: ['in-progress', 'completed'] }
    }).populate('hiredFreelancer', 'name email');

    return successResponse(res, 200, {
      message: 'Client jobs retrieved successfully.',
      data: jobs
    });
  } catch (error) {
    console.error('Client job fetch error:', error);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to fetch client jobs.'));
  }
};


export const getFreelancerActiveAndCompletedJobs = async (req, res, next) => {
  try {
    const freelancerId = req.user._id;

    const jobs = await Job.find({
      hiredFreelancer: freelancerId,
      status: { $in: ['in-progress', 'completed'] }
    }).populate('client', 'name email company');

    return successResponse(res, 200, {
      message: 'Freelancer jobs retrieved successfully.',
      data: jobs
    });
  } catch (error) {
    console.error('Freelancer job fetch error:', error);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to fetch freelancer jobs.'));
  }
};


