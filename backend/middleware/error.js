/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for developer
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let errors = {};

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    
    // Extract field-specific error messages
    Object.values(err.errors).forEach((error) => {
      errors[error.path] = error.message;
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    
    // Extract the field that caused the duplication
    const field = Object.keys(err.keyValue)[0];
    errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
    errors.id = `Invalid ${err.path}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errors.token = err.message;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errors.token = 'Your token has expired. Please log in again';
  }

  // Send standardized response
  res.status(statusCode).json({
    success: false,
    message,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};