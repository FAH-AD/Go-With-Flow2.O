import nodemailer from 'nodemailer';

/**
 * Send email utility function
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text content
 * @param {String} options.html - HTML content
 * @returns {Promise} Email send result
 */
export const sendEmail = async (options) => {
  // In development, use a testing service like Mailtrap
  // In production, use a real email service like SendGrid, Mailgun, etc.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // App password, NOT your Gmail password
    },
  });

  const message = {
    from: process.env.EMAIL_USER|| 'noreply@freelanceplatform.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Don't throw error in development if email credentials are not set
  try {
    const info = await transporter.sendMail(message);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    
    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log('Email would have been sent:');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Content:', options.text || options.html);
      return { messageId: 'dev-mode' };
    }
    
    throw error;
  }
};