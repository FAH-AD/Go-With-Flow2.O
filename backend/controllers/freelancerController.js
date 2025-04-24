import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/sendEmail.js';
import { customErrorHandler, successResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import { createMilestoneEscrowPayment } from '../controllers/paymentController.js';

// Freelancer responds to a job offer
export const respondToJobOffer = async (req, res) => {
  try {
    const { jobId, offerId } = req.params;
    const { accept } = req.body;

    const job = await Job.findById(jobId).populate('client');
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

    const offer = job.offers.id(offerId);
    if (!offer) return customErrorHandler(res, new Error('Offer not found'), 404);

    if (offer.freelancer.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: This offer is not for you'), 403);
    }

    if (offer.status !== 'pending') {
      return customErrorHandler(res, new Error('This offer is no longer pending'), 400);
    }

    if (accept) {
      // Accept the offer
      offer.status = 'accepted';
      job.status = 'in-progress';
      job.hiredFreelancer = req.user._id;

      const milestoneId = new mongoose.Types.ObjectId();
      const initialMilestone = {
        _id: milestoneId,
        title: offer.milestoneTitle,
        description: offer.milestoneDescription,
        amount: offer.milestoneAmount,
        deadline: new Date(offer.milestoneDeadline),
        status: 'in-progress'
      };
      if (!job.milestones) {
        job.milestones = [];
      }
      job.milestones.push(initialMilestone);

      // Create milestone escrow payment
      try {
        const payment = await createMilestoneEscrowPayment(
            job._id,
            req.user._id,
            milestoneId,
            offer.milestoneAmount,
            job.client._id
          );
        initialMilestone.paymentId = payment._id;
      } catch (error) {
        console.log(offer.milestoneAmount)
        return customErrorHandler(res, new Error('Failed to create escrow payment'), 500);
      }

      const freelancer = await User.findById(req.user._id);
      if (!freelancer.totalHires) {
        freelancer.totalHires = [];
      }
      freelancer.totalHires.push({
        job: job._id,
        role: 'Individual Hire',
        totalBudget: offer.milestoneAmount,
        earned: 0
      });
      await freelancer.save();

      // Update client
      const client = job.client;
      if (!client.totalHires) {
        client.totalHires = [];
      }
      client.totalHires.push({
        freelancer: {
          id: freelancer._id,
          name: freelancer.name,
          skills: freelancer.skills
        },
        job: {
          id: job._id,
          title: job.title,
          totalBudget: job.budget,
          paid: 0
        },
        activeMilestones: [initialMilestone._id],
        approvedMilestones: [],
        totalPaid: 0,
        pendingPayment: offer.milestoneAmount
      });
      await client.save();

      // Notify client
      await Notification.create({
        recipient: job.client._id,
        type: 'job-updated',
        title: 'Job Offer Accepted',
        message: `Your offer for "${job.title}" has been accepted by the freelancer.`,
        data: {
          job: job._id,
          freelancer: freelancer._id,
        },
      });

      // Send email notification
      await sendEmail({
        to: client.email,
       subject: 'Job Offer Accepted',
        text: `The freelancer has accepted your offer for the job "${job.title}".`}
      );

      await sendEmail({
        to:freelancer.email,
        subject:'Job Offer Accepted',
        text:`Your Job "${job.title} has been started".`}
      );
    } else {
      // Reject the offer
      offer.status = 'rejected';

      // Notify client
      await Notification.create({
        recipient: job.client._id,
        type: 'offer-rejected',
        title: 'Job Offer Rejected',
        message: `Your offer for "${job.title}" has been rejected by the freelancer.`,
        data: {
          job: job._id,
          freelancer: req.user._id,
        },
      });

      // Send email notification
      const client = job.client;
      await sendEmail({
        to:client.email,
        subject:'Job Offer Rejected',
        text:`The freelancer has rejected your offer for the job "${job.title}".`}
      );
    }

    await job.save();

    return successResponse(res, 200, `Job offer ${accept ? 'accepted' : 'rejected'} successfully`);
  } catch (error) {
    return customErrorHandler(res, error);
  }
};

// Freelancer responds to a team offer
export const respondToTeamOffer = async (req, res) => {
  try {
    const { jobId, offerId } = req.params;
    const { accept } = req.body;

    const job = await Job.findById(jobId).populate('client');
    if (!job) return customErrorHandler(res, new Error('Job not found'), 404);

    const offer = job.teamOffers.id(offerId);
    if (!offer) return customErrorHandler(res, new Error('Team offer not found'), 404);

    if (offer.freelancer.toString() !== req.user._id.toString()) {
      return customErrorHandler(res, new Error('Unauthorized: This team offer is not for you'), 403);
    }

    if (offer.status !== 'pending') {
      return customErrorHandler(res, new Error('This team offer is no longer pending'), 400);
    }

    if (accept) {
      // Accept the offer
      offer.status = 'accepted';
      
      const milestoneId = new mongoose.Types.ObjectId();
      const initialMilestone = {
        _id: milestoneId,
        title: offer.milestoneTitle,
        description: offer.milestoneDescription,
        amount: offer.milestoneAmount,
        deadline: new Date(offer.milestoneDeadline),
        status: 'in-progress'
      };

      // Create milestone escrow payment
      try {
        // In freelancerController.js
        const payment = await createMilestoneEscrowPayment(
            jobId,
            req.user._id,
            milestoneId,
            offer.milestoneAmount,
            job.createdBy // Assuming job.client is populated and contains the client's ID
          );
        // const payment = await createMilestoneEscrowPayment(
        //   job._id,
        //   req.user._id,
        //   milestoneId,
        //   offer.milestoneAmount
        // );
        initialMilestone.paymentId = payment._id;
      } catch (error) {
        return customErrorHandler(res, new Error('Failed to create escrow payment'), 500);
      }

      // Add team member to job
      job.team.push({ 
        freelancer: req.user._id, 
        role: offer.role, 
        bid: offer.bid,
        skills: job.crowdsourcingRoles.find(r => r.title === offer.role).skills,
        milestones: [initialMilestone]
      });

      // Update role status
      const role = job.crowdsourcingRoles.find(r => r.title === offer.role);
      role.status = 'filled';

      // Update job status if all roles are filled
      if (job.crowdsourcingRoles.every(r => r.status === 'filled')) {
        job.status = 'in-progress';
      }

      // Add freelancer to group conversation
      const conversation = await Conversation.findById(job.groupConversation);
      if (conversation) {
        conversation.participants.push(req.user._id);
        await conversation.save();
      }

      const freelancer = await User.findById(req.user._id);
      freelancer.totalHires.push({
        job: job._id,
        role: offer.role,
        totalBudget: offer.milestoneAmount,
        earned: 0
      });
      freelancer.payments.inProgress += offer.milestoneAmount;
      await freelancer.save();

      // Notify client
      await Notification.create({
        recipient: job.client._id,
        type: 'team-offer-accepted',
        title: 'Team Offer Accepted',
        message: `Your team offer for "${job.title}" (${offer.role}) has been accepted by the freelancer.`,
        data: {
          job: job._id,
          freelancer: freelancer._id,
          role: offer.role
        },
      });

      // Send email notification
      const client = job.client;
      await sendEmail({
       to: client.email,
       subject: 'Team Offer Accepted',
        text:`The freelancer has accepted your team offer for the job "${job.title}" (${offer.role}).`}
      );
    } else {
      // Reject the offer
      offer.status = 'rejected';

      // Notify client
      await Notification.create({
        recipient: job.client._id,
        type: 'team-offer-rejected',
        title: 'Team Offer Rejected',
        message: `Your team offer for "${job.title}" (${offer.role}) has been rejected by the freelancer.`,
        data: {
          job: job._id,
          freelancer: req.user._id,
          role: offer.role
        },
      });

      // Send email notification
      const client = job.client;
      await sendEmail({
       to: client.email,
       subject: 'Team Offer Rejected',
        text:`The freelancer has rejected your team offer for the job "${job.title}" (${offer.role}).`}
      );
    }

    await job.save();

    return successResponse(res, 200, `Team offer ${accept ? 'accepted' : 'rejected'} successfully`);
  } catch (error) {
    return customErrorHandler(res, error);
  }
};

// Get all pending offers for a freelancer
// Get all pending offers for a freelancer
export const getPendingOffers = async (req, res) => {
  try {
    const jobs = await Job.find({
      $or: [
        { 'offers': { $elemMatch: { freelancer: req.user._id, status: 'pending' } } },
        { 'teamOffers': { $elemMatch: { freelancer: req.user._id, status: 'pending' } } }
      ]
    }).select('title client offers teamOffers');

    const pendingOffers = jobs.flatMap(job => {
      const individualOffers = job.offers
        .filter(offer => offer.freelancer.toString() === req.user._id.toString() && offer.status === 'pending')
        .map(offer => ({
          jobId: job._id,
          jobTitle: job.title,
          client: job.client,
          offerType: 'individual',
          
          
          ...offer.toObject()
        }
    
    ));
    
      const teamOffers = job.teamOffers
        .filter(offer => offer.freelancer.toString() === req.user._id.toString() && offer.status === 'pending')
        .map(offer => ({
          jobId: job._id,
          jobTitle: job.title,
          client: job.client,
          offerType: 'team',
          title: offer.milestoneTitle,
          description: offer.milestoneDescription,
          amount: offer.milestoneAmount,
          deadline: offer.milestoneDeadline
          ,
          ...offer.toObject()
        }));

      return [...individualOffers, ...teamOffers];
    });

    return successResponse(res, 200, 'Pending offers retrieved successfully', pendingOffers);
  } catch (error) {
    return customErrorHandler(res, error);
  }
};