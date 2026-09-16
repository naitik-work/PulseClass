const Session = require('../models/Session');
const Classroom = require('../models/Classroom');
const Poll = require('../models/Poll');
const Response = require('../models/Response');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/sessions/start — Start a live session (instructor only)
 */
const startSession = async (req, res, next) => {
  try {
    const { classroomId } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      throw ApiError.notFound('Classroom not found');
    }

    // Verify instructor owns the classroom
    if (classroom.instructor.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('Only the classroom instructor can start a session');
    }

    // Check for existing active session
    if (classroom.activeSession) {
      const existingSession = await Session.findById(classroom.activeSession);
      if (existingSession && existingSession.isActive) {
        throw ApiError.conflict('An active session already exists for this classroom');
      }
    }

    const session = await Session.create({
      classroom: classroomId,
      instructor: req.user._id,
      participants: [req.user._id],
    });

    // Set active session on classroom
    classroom.activeSession = session._id;
    await classroom.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sessions/:id — Get session details
 */
const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('classroom', 'name institute')
      .populate('instructor', 'name');

    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    // Verify user has access
    const classroom = await Classroom.findById(session.classroom._id || session.classroom);
    const isInstructor = session.instructor._id.toString() === req.user._id.toString();
    const isStudent = classroom?.students?.some(
      (s) => s.toString() === req.user._id.toString()
    );

    if (!isInstructor && !isStudent) {
      throw ApiError.forbidden('You do not have access to this session');
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/sessions/:id/end — End a session (instructor only)
 */
const endSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    if (session.instructor.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('Only the session instructor can end the session');
    }

    if (!session.isActive) {
      throw ApiError.conflict('Session is already ended');
    }

    // Close any active polls
    await Poll.updateMany(
      { session: session._id, isActive: true },
      { isActive: false, closedAt: new Date() }
    );

    session.isActive = false;
    session.endedAt = new Date();
    await session.save();

    // Clear active session from classroom
    await Classroom.findByIdAndUpdate(session.classroom, { activeSession: null });

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sessions/:id/report — Get session report
 */
const getSessionReport = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('classroom', 'name')
      .populate('instructor', 'name');

    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    // Only instructor can view reports
    if (session.instructor._id.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('Only the session instructor can view reports');
    }

    // Get all polls for this session
    const polls = await Poll.find({ session: session._id }).sort({ launchedAt: 1 });

    // Get responses for each poll
    const pollReports = await Promise.all(
      polls.map(async (poll) => {
        const responses = await Response.find({ poll: poll._id });
        const distribution = calculateDistribution(poll, responses);

        return {
          _id: poll._id,
          question: poll.question,
          category: poll.category,
          responseType: poll.responseType,
          options: poll.options,
          timer: poll.timer,
          isAnonymous: poll.isAnonymous,
          launchedAt: poll.launchedAt,
          closedAt: poll.closedAt,
          responseCount: responses.length,
          distribution,
        };
      })
    );

    // Calculate totals
    const totalResponses = pollReports.reduce((sum, p) => sum + p.responseCount, 0);
    const participantCount = session.participants.length;
    const avgParticipation =
      polls.length > 0
        ? Math.round(
            (totalResponses / (polls.length * Math.max(participantCount - 1, 1))) * 100
          )
        : 0;

    const report = {
      session: {
        _id: session._id,
        classroom: session.classroom,
        instructor: session.instructor,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        isActive: session.isActive,
        duration: session.endedAt
          ? Math.round((session.endedAt - session.startedAt) / 1000)
          : null,
      },
      participantCount,
      totalPolls: polls.length,
      totalResponses,
      avgParticipation: Math.min(avgParticipation, 100),
      polls: pollReports,
    };

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/classrooms/:id/sessions — List sessions for a classroom
 */
const getClassroomSessions = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      throw ApiError.notFound('Classroom not found');
    }

    // Verify access
    const isInstructor = classroom.instructor.toString() === req.user._id.toString();
    const isStudent = classroom.students.some(
      (s) => s.toString() === req.user._id.toString()
    );
    if (!isInstructor && !isStudent) {
      throw ApiError.forbidden('You do not have access to this classroom');
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      Session.find({ classroom: req.params.id })
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('instructor', 'name'),
      Session.countDocuments({ classroom: req.params.id }),
    ]);

    // Get poll counts for each session
    const sessionsWithStats = await Promise.all(
      sessions.map(async (session) => {
        const pollCount = await Poll.countDocuments({ session: session._id });
        const responseCount = await Response.countDocuments({
          poll: { $in: await Poll.find({ session: session._id }).distinct('_id') },
        });
        return {
          ...session.toObject(),
          pollCount,
          responseCount,
          participantCount: session.participants.length,
        };
      })
    );

    res.json({
      success: true,
      sessions: sessionsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const { calculateDistribution } = require('../utils/helpers');

module.exports = {
  startSession,
  getSession,
  endSession,
  getSessionReport,
  getClassroomSessions,
  calculateDistribution,
};
