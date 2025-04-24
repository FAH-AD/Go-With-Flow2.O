import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js'; // your existing utility
import asyncHandler from 'express-async-handler';
import { promises as dns } from 'dns';


const freeEmailDomains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'protonmail.com', 'icloud.com', 'aol.com', 'zoho.com', 'mail.com'
];

const isEducationEmail = (domain) => {
  return (
    domain.endsWith('.edu') ||
    domain.includes('.ac.') ||
    domain.includes('.edu.')
  );
};

const isCompanyEmail = (domain) => {
  return !freeEmailDomains.includes(domain) && !isEducationEmail(domain);
};
export const requestClientVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { method } = req.body;
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);
  console.log('USER:', req.user);
  if (!['document', 'companyEmail'].includes(method)) {
    res.status(400);
    throw new Error('Invalid verification method');
  }

  if (method === 'document') {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('At least one document is required');
    }

    const fileUrls = req.files.map(file => file.path);
    user.clientVerification = {
      method,
      status: 'pending',
      document: fileUrls,
    };

    await user.save();

    // Send email to admin
    await sendEmail({
      to: 'alyfahad355@gmail.com',
      subject: 'Client Verification Request',
      text: `User ${user.name} has submitted documents for verification.\n\nDocument URLs:\n${fileUrls.join('\n')}`,
    });

    return res.status(200).json({ message: 'Document submitted for verification' });
  }


  if (method === 'companyEmail') {
   

    try {
      const { email } = req.user; 
      const domain = email.split('@')[1].toLowerCase();

      // Domain validation
      if (!isCompanyEmail(domain)) {
        return res.status(400).json({
          success: false,
          error: 'Please use a valid company email address.',
        });
      }

      // DNS check
      await dns.resolveMx(domain);

      // Generate code
      const verificationCode = crypto.randomInt(100000, 999999).toString();

      // Save to user
      const user = await User.findById(req.user._id);
      user.companyEmailVerificationCode = verificationCode;
      user.companyEmailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 mins
      user.clientVerification = {
        method: 'companyEmail',
        status: 'pending',
      };
      await user.save();

      // Send email
      await sendEmail({
        to: email,
        subject: 'Verify Your Company Email',
        text: `Your verification code is: ${verificationCode}`,
      });

      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your company email',
      });

    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        error: 'Domain verification failed. Please use a valid company email.',
      });
    }
  };
});


export const verifyCompanyEmailCode = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user._id);

    if (
      !user.companyEmailVerificationCode ||
      !user.companyEmailVerificationExpires ||
      user.companyEmailVerificationExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Verification code expired. Please request a new one.',
      });
    }

    if (user.companyEmailVerificationCode !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code.',
      });
    }

    user.clientVerification.status = 'verified';
    user.companyEmailVerificationCode = undefined;
    user.companyEmailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Company email successfully verified!',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during verification.',
    });
  }
};
