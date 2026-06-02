import { logger } from '../utils/logger.js';

/**
 * Express error handling middleware.
 * Formats errors uniformly as JSON instead of stack traces.
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'An unexpected server error occurred. Please try again.';

  logger.error(`Error response sent [${status}]: ${message}`, err);

  res.status(status).json({
    success: false,
    message
  });
};
