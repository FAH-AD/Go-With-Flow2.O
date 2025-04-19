import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware to verify admin role
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(
      res,
      403,
      'Unauthorized',
      { role: 'Admin role required to access this resource' }
    );
  }
};

/**
 * Middleware to verify client role
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const isClient = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    return errorResponse(
      res,
      403,
      'Unauthorized',
      { role: 'Client role required to access this resource' }
    );
  }
};

/**
 * Middleware to verify freelancer role
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const isFreelancer = (req, res, next) => {
  if (req.user && req.user.role === 'freelancer') {
    next();
  } else {
    return errorResponse(
      res,
      403,
      'Unauthorized',
      { role: 'Freelancer role required to access this resource' }
    );
  }
};

/**
 * Middleware to verify client or admin role
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const isClientOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'client' || req.user.role === 'admin')) {
    next();
  } else {
    return errorResponse(
      res,
      403,
      'Unauthorized',
      { role: 'Client or Admin role required to access this resource' }
    );
  }
};

/**
 * Middleware to verify freelancer or admin role
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const isFreelancerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'freelancer' || req.user.role === 'admin')) {
    next();
  } else {
    return errorResponse(
      res,
      403,
      'Unauthorized',
      { role: 'Freelancer or Admin role required to access this resource' }
    );
  }
};