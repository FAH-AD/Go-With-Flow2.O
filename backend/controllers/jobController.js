import { sendEmail } from '../utils/sendEmail.js';
import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import Bid from '../models/Bid.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { customErrorHandler,successResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { createMilestoneEscrowPayment } from '../controllers/paymentController.js';
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
    const {
      title,
      description,
      subCategory,
      skills,
      budget,
      deadline,
      duration,
      experienceLevel,
      location,
      attachments,
      isPromoted,
      isPublic,
      isCrowdsourced,
      crowdsourcingRoles,
      milestones
    } = req.body;

    const jobData = {
      title,
      description,
      client: req.user.id,
      subCategory,
      skills,
      budget,
      deadline,
      duration,
      experienceLevel,
      location,
      attachments,
      isPromoted: isPromoted || false,
      isPublic: isPublic !== undefined ? isPublic : true,
      isCrowdsourced: isCrowdsourced || false,
      crowdsourcingRoles: isCrowdsourced ? crowdsourcingRoles : [],
      milestones: milestones || []
    };

    const job = await Job.create(jobData);

    if (isCrowdsourced) {
      const conversation = new Conversation({
        participants: [req.user.id],
        job: job._id,
        isGroup: true,
        name: `Team for: ${job.title}`,
        admin: req.user.id
      });
      await conversation.save();
      
      job.groupConversation = conversation._id;
      await job.save();
    }

    sendResponse(res, httpStatus.CREATED, 'Job has been successfully posted.', job);
  } catch (error) {
    next(new ApiError(httpStatus.BAD_REQUEST, `Failed to post job: ${error.message}`));
  }
};

// 2. Get All Jobs
export const getJobs = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated.'));
    }

    const freelancer = await User.findById(req.user.id);
    if (!freelancer) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found.'));
    }

    const freelancerSkills = (freelancer.skills || []).map(skill => skill.toLowerCase());

      // Fetch all open jobs
      const allJobs = await Job.find({ status: 'open' })
        .populate('client', 'name email profileImage')
        .sort({ createdAt: -1 });
  
      const matchingJobs = allJobs.filter(job => {
        const jobObj = job.toObject();
        let jobSkills = [];
  
        if (job.isCrowdsourced) {
          // For crowdsourced jobs, collect skills from all roles
          jobSkills = [...new Set(jobObj.crowdsourcingRoles.flatMap(role => role.skills.map(s => s.toLowerCase())))];
        } else {
          // For simple jobs, use the job skills
          jobSkills = (jobObj.skills || []).map(s => s.toLowerCase());
        }
  
        // Check if there's at least one matching skill
        return jobSkills.some(skill => freelancerSkills.includes(skill));
      }).map(job => {
        const jobObj = job.toObject();
        let jobSkills = [];
  
        if (job.isCrowdsourced) {
          jobSkills = [...new Set(jobObj.crowdsourcingRoles.flatMap(role => role.skills.map(s => s.toLowerCase())))];
        } else {
          jobSkills = (jobObj.skills || []).map(s => s.toLowerCase());
        }
  
        const matchingSkills = jobSkills.filter(skill => freelancerSkills.includes(skill));
        const matchPercentage = jobSkills.length > 0
          ? Math.round((matchingSkills.length / jobSkills.length) * 100)
          : 0;
  
        return {
          ...jobObj,
          skillMatchPercentage: matchPercentage
        };
      });
  
      // Sort by match percentage (highest to lowest)
      matchingJobs.sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);
  
      sendResponse(res, httpStatus.OK, 'Jobs retrieved successfully.', matchingJobs);
    } catch (error) {
      console.error('Error in getJobs:', error);
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

// 8. Hire Freelancer (Send Offer)
export const hireFreelancer = async (req, res) => {
  try {
    const { id, bidId } = req.params;
    const { milestoneTitle, milestoneDescription, milestoneAmount, milestoneDeadline } = req.body;

    if (!milestoneTitle || !milestoneDescription || !milestoneAmount || !milestoneDeadline) {
      return customErrorHandler(res, new Error('Missing required fields'), 400);
    }
    const job = await Job.findById(id);
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

    if (job.client.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: You can only hire for your own jobs'), 403);
    }

    if (job.status !== 'open') {
      return customErrorHandler(res, new Error(`Cannot hire for job with status ${job.status}`), 400);
    }

    const bid = await Bid.findById(bidId);
    if (!bid) return customErrorHandler(res, new Error('Bid not found'), 404);
    if (bid.job.toString() !== job._id.toString()) {
      return customErrorHandler(res, new Error('Bid does not belong to this job'), 400);
    }

    // Create offer
    const offer = {
      freelancer: bid.freelancer,
      status: 'pending',
      milestoneTitle: milestoneTitle,
      milestoneDescription: milestoneDescription,
      milestoneAmount: milestoneAmount,
      milestoneDeadline: milestoneDeadline
    };

    console.log('Offer:', offer);

    job.offers = job.offers || [];
    job.offers.push(offer);
    await job.save();

    // Notify freelancer
    await Notification.create({
      recipient: bid.freelancer,
      type: 'job-updated',
      title: 'New Job Offer',
      message: `You've received an offer for the job "${job.title}". Please review and respond.`,
      data: {
        job: job._id,
        sender: req.user._id,
        bid: bid._id,
      },
    });

    // Send email notification
    const freelancer = await User.findById(bid.freelancer);
    await sendEmail({
      to:freelancer.email,
      subject:'New Job Offer',
      text:`You've received an offer for the job "${job.title}". Please log in to review and respond.`
  });

    return successResponse(res, 200, 'Job offer sent successfully');
  } catch (error) {
    return customErrorHandler(res, error);
  }
};

export const addTeamMember = async (req, res) => {
  try {
    const { id, bidId } = req.params;
    const { roleTitle, milestoneTitle, milestoneDescription, milestoneAmount, milestoneDeadline } = req.body;

    const job = await Job.findById(id);
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

    if (job.client.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: You can only modify your own jobs'), 403);
    }

    if (!job.isCrowdsourced) {
      return customErrorHandler(res, new Error('This job is not set for crowdsourcing'), 400);
    }

    const role = job.crowdsourcingRoles.find(r => r.title === roleTitle);
    if (!role) return customErrorHandler(res, new Error('Role not found'), 404);

    if (role.status === 'filled') {
      return customErrorHandler(res, new Error('This role has already been filled'), 400);
    }
    const bid = await Bid.findById(bidId);
    if (!bid) return customErrorHandler(res, new Error('Bid not found'), 404);
    if (bid.job.toString() !== job._id.toString()) {
      return customErrorHandler(res, new Error('Bid does not belong to this job'), 400);
    }

    // Create offer
    const offer = {
      freelancer: bid.freelancer,
      role: roleTitle,
      status: 'pending',
      milestoneTitle,
      milestoneDescription,
      milestoneAmount,
      milestoneDeadline
    };

    job.teamOffers = job.teamOffers || [];
    job.teamOffers.push(offer);
    await job.save();

    // Notify freelancer
    await Notification.create({
      recipient: bid.freelancer,
      type: 'job-updated',
      title: 'New Team Offer',
      message: `You've received an offer to join the team for "${job.title}" as ${roleTitle}. Please review and respond.`,
      data: {
        job: job._id,
        sender: req.user._id,
        bid: bid._id,
      },
    });

    // Send email notification
    const freelancer = await User.findById(bid.freelancer);
    await sendEmail({
      to: freelancer.email,
      subject:'New Team Offer',
      text:`You've received an offer to join the team for "${job.title}" as ${roleTitle}. Please log in to review and respond.`}
    );

    return successResponse(res, 200, 'Team offer sent successfully');
  } catch (error) {
    return customErrorHandler(res, error);
  }
};

/*
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
    
    // Get the hired freelancer
    const hiredFreelancer = await User.findById(job.hiredFreelancer);

    // Send email notifications
    await sendEmail({
     to: hiredFreelancer.email,
     subject: 'Job Completed',
      text:`The job "${job.title}" has been marked as completed by the client.`}
    );
    await sendEmail({
     to: req.user.email,
      subject:'Job Marked as Completed',
      text:`You've marked the job "${job.title}" as completed.`}
    );

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

export const enableCrowdsourcing = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    const job = await Job.findById(id);
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

    if (job.client.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: You can only modify your own jobs'), 403);
    }

    if (job.status !== 'open') {
      return customErrorHandler(res, new Error(`Cannot enable crowdsourcing for job with status ${job.status}`), 400);
    }

    job.isCrowdsourced = true;
    job.crowdsourcingRoles = roles.map(role => ({
      title: role.title,
      description: role.description,
      skills: role.skills,
      budget: role.budget,
      status: 'open'
    }));

    const conversation = new Conversation({
      participants: [job.client],
      job: job._id,
      isGroup: true,
      name: `Team for: ${job.title}`,
      admin: job.client
    });
    await conversation.save();
    
    job.groupConversation = conversation._id;
    await job.save();

    return successResponse(res, 200, 'Crowdsourcing enabled successfully', job);
  } catch (error) {
    return customErrorHandler(res, error);
  }
};



export const removeTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { feedback } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    const teamMember = job.team.id(memberId);
    if (!teamMember) return res.status(404).json({ message: 'Team member not found' });
    
    teamMember.status = 'removed';
    teamMember.removedAt = Date.now();
    teamMember.feedback = feedback;
    await job.save();
    
    // Remove freelancer from group conversation
    await Conversation.findByIdAndUpdate(job.groupConversation, 
      { $pull: { participants: teamMember.freelancer } });
    
    res.status(200).json({ message: 'Team member removed', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { freelancerId, title, description, amount, deadline } = req.body;

    const job = await Job.findById(id).populate('hiredFreelancer');
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

    if (job.client.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: You can only add milestones to your own jobs'), 403);
    }

    const milestoneId = new mongoose.Types.ObjectId();
    const newMilestone = {
      _id: milestoneId,
      title,
      description,
      amount,
      deadline: new Date(deadline),
      status: 'in-progress'
    };

    let freelancer;

    if (job.isCrowdsourced) {
      const teamMember = job.team.find(member => member.freelancer.toString() === freelancerId);
      if (!teamMember) return customErrorHandler(res, new Error('Team member not found'), 404);
      teamMember.milestones.push(newMilestone);
      freelancer = await User.findById(freelancerId);
    } else {
      if (job.hiredFreelancer._id.toString() !== freelancerId) {
        return customErrorHandler(res, new Error('Freelancer not hired for this job'), 403);
      }
      job.milestones.push(newMilestone);
      freelancer = job.hiredFreelancer;
    }

    await job.save();

    // Update freelancer's hires and payments
    if (freelancer) {
      let hireEntry = freelancer.hires.find(hire => hire.job.toString() === job._id.toString());
      if (!hireEntry) {
        hireEntry = {
          job: job._id,
          activeMilestones: [],
          approvedMilestones: [],
          totalBudget: 0,
          earned: 0
        };
        freelancer.hires.push(hireEntry);
      }
      hireEntry.activeMilestones.push(milestoneId);
      hireEntry.totalBudget += amount;
      
      freelancer.payments = freelancer.payments || { inProgress: 0, pending: 0, available: 0 };
      freelancer.payments.inProgress += amount;
      
      await freelancer.save();
    }

    // Update client's hires
    const client = await User.findById(req.user._id);
    let clientHireEntry = client.hires.find(hire => hire.job.toString() === job._id.toString());
    if (!clientHireEntry) {
      clientHireEntry = {
        freelancer: {
          id: freelancer._id,
          name: freelancer.name,
          skills: freelancer.skills
        },
        job: {
          id: job._id,
          title: job.title,
          totalBudget: 0,
          paid: 0
        },
        activeMilestones: [],
        approvedMilestones: [],
        totalPaid: 0,
        pendingPayment: 0
      };
      client.hires.push(clientHireEntry);
    }
    clientHireEntry.job.totalBudget += amount;
    clientHireEntry.activeMilestones.push(milestoneId);
    clientHireEntry.pendingPayment += amount;
    await client.save();

    // Send email notification to freelancer
    await sendEmail({
      to: freelancer.email,
      subject: 'New Milestone Added',
      text: `A new milestone "${title}" has been added to the job "${job.title}". Please review it in your dashboard.`
    });

    return successResponse(res, 200, 'Milestone added successfully', { job, newMilestone });
  } catch (error) {
    return customErrorHandler(res, error);
  }
};

export const approveMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;

    const job = await Job.findById(id).populate('hiredFreelancer');
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

    if (job.client.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: You can only approve milestones for your own jobs'), 403);
    }

    let milestone;
    let freelancer;

    if (job.isCrowdsourced) {
      const teamMember = job.team.find(member => 
        member.milestones.some(m => m._id.toString() === milestoneId)
      );
      if (!teamMember) return customErrorHandler(res, new Error('Milestone not found'), 404);
      milestone = teamMember.milestones.id(milestoneId);
      freelancer = await User.findById(teamMember.freelancer);
    } else {
      milestone = job.milestones.id(milestoneId);
      freelancer = job.hiredFreelancer;
    }

    if (!milestone) return customErrorHandler(res, new Error('Milestone not found'), 404);

    if (milestone.status !== 'in-progress') {
      return customErrorHandler(res, new Error('Can only approve in-progress milestones'), 400);
    }

    // Update freelancer's hires and payments
    let hireEntry = freelancer.hires.find(hire => hire.job.toString() === job._id.toString());
    
    if (!hireEntry) {
      hireEntry = {
        job: job._id,
        activeMilestones: [],
        approvedMilestones: [],
        totalBudget: 0,
        earned: 0
      };
      freelancer.hires.push(hireEntry);
    }

    hireEntry.activeMilestones = hireEntry.activeMilestones.filter(m => m.toString() !== milestoneId);
    hireEntry.approvedMilestones.push(milestoneId);
    hireEntry.earned += milestone.amount;

    freelancer.payments = freelancer.payments || { inProgress: 0, pending: 0, available: 0 };
    freelancer.payments.inProgress = Math.max(0, (freelancer.payments.inProgress || 0) - milestone.amount);
    freelancer.payments.pending = (freelancer.payments.pending || 0) + milestone.amount;

    await freelancer.save();

    // Update client's hires
    const client = await User.findById(req.user._id);
    let clientHireEntry = client.hires.find(hire => hire.job.toString() === job._id.toString());
    if (clientHireEntry) {
      clientHireEntry.activeMilestones = clientHireEntry.activeMilestones.filter(m => m.toString() !== milestoneId);
      clientHireEntry.approvedMilestones.push(milestoneId);
      clientHireEntry.totalPaid += milestone.amount;
      clientHireEntry.pendingPayment -= milestone.amount;
      clientHireEntry.job.paid += milestone.amount;
    }
    await client.save();

    milestone.status = 'approved';
    milestone.approvalDate = new Date();
    await job.save();

    // Schedule payment to be available after 3 days
    setTimeout(async () => {
      try {
        const updatedFreelancer = await User.findById(freelancer._id);
        updatedFreelancer.payments.pending = Math.max(0, updatedFreelancer.payments.pending - milestone.amount);
        updatedFreelancer.payments.available = (updatedFreelancer.payments.available || 0) + milestone.amount;
        await updatedFreelancer.save();
        console.log('Scheduled payment update completed');
      } catch (error) {
        console.error('Error in scheduled payment update:', error);
      }
    }, 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds

    // Send email notification to freelancer
    await sendEmail({
      to: freelancer.email,
      subject: 'Milestone Approved',
      text: `Your milestone "${milestone.title}" for the job "${job.title}" has been approved. The payment will be processed soon.`
    });

    return successResponse(res, 200, 'Milestone approved successfully');
  } catch (error) {
    console.error('Error in approveMilestone:', error);
    return customErrorHandler(res, error);
  }
};


export const getAllClientJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .populate('client', 'name email profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments();

    const jobsWithClientInfo = jobs.map(job => ({
      ...job.toObject(),
      clientName: job.client.name,
      clientEmail: job.client.email,
      clientProfileImage: job.client.profileImage
    }));

    sendResponse(res, httpStatus.OK, 'All client jobs retrieved successfully.', {
      jobs: jobsWithClientInfo,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs
    });
  } catch (error) {
    console.error('Error in getAllClientJobs:', error);
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to fetch all client jobs.'));
  }
};

export const getJobMilestones = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return customErrorHandler(res, new Error('Job not found'), 404);
    }

    let milestones = [];

    if (job.isCrowdsourced) {
      // For crowdsourced jobs, collect milestones from all team members
      job.team.forEach(member => {
        milestones = milestones.concat(member.milestones.map(milestone => ({
          ...milestone.toObject(),
          freelancerId: member.freelancer,
          freelancerRole: member.role
        })));
      });
    } else {
      // For regular jobs, use the job's milestones
      milestones = job.milestones;
    }

    return successResponse(res, 200, 'Milestones retrieved successfully', { 
      jobTitle: job.title,
      isCrowdsourced: job.isCrowdsourced,
      milestones 
    });
  } catch (error) {
    return customErrorHandler(res, error);
  }
};


