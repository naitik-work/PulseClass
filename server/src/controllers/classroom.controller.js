const Classroom = require('../models/Classroom');
const Institute = require('../models/Institute');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/classrooms — Create classroom (instructor only)
 */
const createClassroom = async (req, res, next) => {
  try {
    const { name, instituteId } = req.body;

    // Verify institute exists and user is the owner
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      throw ApiError.notFound('Institute not found');
    }

    const ownerId = (institute.owner?._id || institute.owner).toString();
    const currentUserId = (req.user?._id || req.user?.id).toString();

    if (ownerId !== currentUserId) {
      throw ApiError.forbidden('Only the institute owner can create classrooms');
    }

    const classroom = await Classroom.create({
      name,
      institute: instituteId,
      instructor: req.user._id,
    });

    res.status(201).json({ success: true, classroom });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/classrooms/:id — Get classroom details
 */
const getClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('students', 'name email')
      .populate('institute', 'name code')
      .populate('activeSession');

    if (!classroom) {
      throw ApiError.notFound('Classroom not found');
    }

    // Verify user has access (instructor or student)
    const isInstructor = classroom.instructor._id.toString() === req.user._id.toString();
    const isStudent = classroom.students.some(
      (s) => s._id.toString() === req.user._id.toString()
    );

    if (!isInstructor && !isStudent) {
      throw ApiError.forbidden('You do not have access to this classroom');
    }

    res.json({ success: true, classroom });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/classrooms/:id/join — Join classroom (student)
 */
const joinClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate('institute');

    if (!classroom) {
      throw ApiError.notFound('Classroom not found');
    }

    // Verify user is a member of the institute
    const institute = await Institute.findById(classroom.institute._id);
    const isMember = institute.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (!isMember) {
      throw ApiError.forbidden('You must join the institute first');
    }

    // Check if already joined
    const alreadyJoined = classroom.students.some(
      (s) => s.toString() === req.user._id.toString()
    );
    if (alreadyJoined) {
      throw ApiError.conflict('You are already in this classroom');
    }

    classroom.students.push(req.user._id);
    await classroom.save();

    res.json({ success: true, classroom });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/institutes/:id/classrooms — List classrooms in an institute
 */
const getInstituteClassrooms = async (req, res, next) => {
  try {
    const instituteId = req.params.id;

    // Verify user is a member or owner of the institute
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      throw ApiError.notFound('Institute not found');
    }

    const currentUserId = (req.user?._id || req.user?.id).toString();
    const isOwner = (institute.owner?._id || institute.owner).toString() === currentUserId;
    const isMember = institute.members.some(
      (m) => (m._id || m).toString() === currentUserId
    );

    if (!isOwner && !isMember) {
      throw ApiError.forbidden('You are not a member of this institute');
    }

    const query = { institute: instituteId };

    const classrooms = await Classroom.find(query)
      .populate('instructor', 'name')
      .populate('activeSession')
      .sort({ createdAt: -1 });

    res.json({ success: true, classrooms });
  } catch (error) {
    next(error);
  }
};

module.exports = { createClassroom, getClassroom, joinClassroom, getInstituteClassrooms };
