const Institute = require('../models/Institute');
const ApiError = require('../utils/ApiError');
const { generateInstituteCode } = require('../utils/helpers');

/**
 * POST /api/institutes — Create institute (instructor only)
 */
const createInstitute = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Generate unique code with retry
    let code;
    let attempts = 0;
    while (attempts < 10) {
      code = generateInstituteCode();
      const existing = await Institute.findOne({ code });
      if (!existing) break;
      attempts++;
    }
    if (attempts >= 10) {
      throw ApiError.internal('Unable to generate unique institute code');
    }

    const institute = await Institute.create({
      name,
      code,
      owner: req.user._id,
      members: [req.user._id],
    });

    // Add institute to user's institutes list
    req.user.institutes.push(institute._id);
    await req.user.save();

    res.status(201).json({ success: true, institute });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/institutes — Get user's institutes
 */
const getInstitutes = async (req, res, next) => {
  try {
    const institutes = await Institute.find({
      _id: { $in: req.user.institutes },
    }).sort({ createdAt: -1 });

    res.json({ success: true, institutes });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/institutes/:id — Get institute details
 */
const getInstitute = async (req, res, next) => {
  try {
    const institute = await Institute.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email role');

    if (!institute) {
      throw ApiError.notFound('Institute not found');
    }

    // Verify user is a member
    const isMember = institute.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      throw ApiError.forbidden('You are not a member of this institute');
    }

    res.json({ success: true, institute });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/institutes/join — Join institute by code (student)
 */
const joinInstitute = async (req, res, next) => {
  try {
    const { code } = req.body;

    const institute = await Institute.findOne({ code });
    if (!institute) {
      throw ApiError.notFound('No institute found with this code. Check the code and try again.');
    }

    // Check if already a member
    const alreadyMember = institute.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      throw ApiError.conflict('You are already a member of this institute');
    }

    institute.members.push(req.user._id);
    await institute.save();

    req.user.institutes.push(institute._id);
    await req.user.save();

    res.json({ success: true, institute });
  } catch (error) {
    next(error);
  }
};

module.exports = { createInstitute, getInstitutes, getInstitute, joinInstitute };
