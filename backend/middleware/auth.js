import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';

/**
 * Middleware to protect routes
 * Verifies JWT token and attaches user to request
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie (could be used in browser)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return errorResponse(
        res,
        401,
        'Not authorized to access this route',
        { token: 'No token provided' }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'freelanceplatformsecret2023'
    );

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');

    // Check if user exists
    if (!user) {
      return errorResponse(
        res,
        401,
        'User not found',
        { user: 'User belonging to this token no longer exists' }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(
        res,
        401,
        'Account is deactivated',
        { account: 'This account has been deactivated' }
      );
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(
      res,
      401,
      'Not authorized to access this route',
      { token: error.message }
    );
  }
};

/**
 * Middleware to restrict access based on user role
 * @param {String[]} roles - Array of allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        'Unauthorized access',
        { role: `Role '${req.user.role}' is not allowed to access this resource` }
      );
    }
    next();
  };
};

/**
 * Middleware to check if user is verified
 */
export const isVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return errorResponse(
      res,
      403,
      'Email not verified',
      { email: 'Please verify your email address before accessing this resource' }
    );
  }
  next();
};