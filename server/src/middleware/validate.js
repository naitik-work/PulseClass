const ApiError = require('../utils/ApiError');

/**
 * Zod validation middleware factory.
 * Validates req.body against the provided Zod schema.
 * Returns first validation error as a 400 response.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.errors[0];
      const message = `${firstError.path.join('.')}: ${firstError.message}`;
      return next(ApiError.badRequest(message));
    }

    // Replace body with parsed/transformed data
    req.body = result.data;
    next();
  };
};

module.exports = validate;
