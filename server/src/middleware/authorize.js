const ApiError = require('../utils/ApiError');

/**
 * Role-based authorization middleware factory.
 * Usage: authorize('instructor') or authorize('instructor', 'student')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
};

module.exports = authorize;
