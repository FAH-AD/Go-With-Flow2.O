/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Response message
 * @param {Object|Array} data - Response data
 * @param {Object} meta - Metadata (e.g., pagination)
 * @returns {Object} Response
 */
export const successResponse = (
  res,
  statusCode = 200,
  message = 'Success',
  data = {},
  meta = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

/**
 * Standard error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object|Array} errors - Error details
 * @returns {Object} Response
 */
export const errorResponse = (
  res,
  statusCode = 500,
  message = 'Error',
  errors = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

// utils/customErrorHandler.js
export const customErrorHandler = (res, error, status = 500, message = 'Something went wrong') => {
  console.error('Custom Error:', error);
  return res.status(status).json({
    success: false,
    message,
    error: error.message || error,
  });
};
