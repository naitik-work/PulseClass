const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

// Cookie options for JWT token
const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * Generate JWT token and set as httpOnly cookie
 */
function setTokenCookie(res, userId) {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, cookieOptions);
  return token;
}

/**
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    // Create user (password is hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role,
    });

    const token = setTokenCookie(res, user._id);

    res.status(201).json({
      success: true,
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user (include passwordHash for comparison)
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = setTokenCookie(res, user._id);

    res.json({
      success: true,
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  res.cookie('token', '', {
    ...cookieOptions,
    maxAge: 0,
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = { signup, login, logout, getMe };
