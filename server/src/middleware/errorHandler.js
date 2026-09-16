const env = require('../config/env');

/**
 * Global error handler middleware.
 * Catches operational errors (ApiError) and unexpected errors.
 * Never exposes stack traces in production.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  // Log error details server-side
  if (!err.isOperational || statusCode >= 500) {
    console.error('Server error:', {
      message: err.message,
      stack: env.isProduction ? undefined : err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
