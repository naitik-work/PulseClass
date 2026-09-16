const ApiError = require('../src/utils/ApiError');
const errorHandler = require('../src/middleware/errorHandler');
const authorize = require('../src/middleware/authorize');
const validate = require('../src/middleware/validate');
const { z } = require('zod');

describe('Middleware & Error Utilities', () => {
  describe('ApiError', () => {
    it('creates standard badRequest error (400)', () => {
      const err = ApiError.badRequest('Invalid parameter');
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Invalid parameter');
    });

    it('creates unauthorized error (401)', () => {
      const err = ApiError.unauthorized('Token expired');
      expect(err.statusCode).toBe(401);
    });

    it('creates forbidden error (403)', () => {
      const err = ApiError.forbidden('Access denied');
      expect(err.statusCode).toBe(403);
    });

    it('creates notFound error (404)', () => {
      const err = ApiError.notFound('Resource not found');
      expect(err.statusCode).toBe(404);
    });

    it('creates conflict error (409)', () => {
      const err = ApiError.conflict('Already exists');
      expect(err.statusCode).toBe(409);
    });
  });

  describe('errorHandler', () => {
    it('formats ApiError correctly into JSON response', () => {
      const err = ApiError.badRequest('Something went wrong');
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Something went wrong',
        })
      );
    });

    it('handles unexpected errors with 500 status', () => {
      const err = new Error('Unexpected crash');
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('authorize', () => {
    it('calls next() when user role matches', () => {
      const middleware = authorize('instructor');
      const req = { user: { role: 'instructor' } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('passes ApiError.forbidden to next when role does not match', () => {
      const middleware = authorize('instructor');
      const req = { user: { role: 'student' } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(403);
    });
  });

  describe('validate', () => {
    const testSchema = z.object({
      title: z.string().min(3),
    });

    it('calls next() on valid body', () => {
      const middleware = validate(testSchema);
      const req = { body: { title: 'Hello World' } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('passes 400 ApiError on invalid body', () => {
      const middleware = validate(testSchema);
      const req = { body: { title: 'Hi' } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });
  });
});
