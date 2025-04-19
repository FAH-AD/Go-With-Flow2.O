import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for authentication
 * @param {String|Number} id - User ID
 * @param {String} [secret=process.env.JWT_SECRET] - JWT secret
 * @param {String|Number} [expiresIn='30d'] - Token expiration time
 * @returns {String} JWT token
 */
export const generateToken = (
  id,
  secret = process.env.JWT_SECRET || 'freelanceplatformsecret2023',
  expiresIn = '30d'
) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token
 * @param {String} [secret=process.env.JWT_SECRET] - JWT secret
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (
  token,
  secret = process.env.JWT_SECRET || 'freelanceplatformsecret2023'
) => {
  return jwt.verify(token, secret);
};