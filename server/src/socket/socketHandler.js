const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const User = require('../models/User');
const Session = require('../models/Session');
const Classroom = require('../models/Classroom');
const Poll = require('../models/Poll');
const Response = require('../models/Response');
const { calculateDistribution } = require('../utils/helpers');
const env = require('../config/env');

// Track active poll timers: pollId -> timeoutId
const activeTimers = new Map();

/**
 * Authenticate socket connection via httpOnly cookie.
 */
async function authenticateSocket(socket, next) {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    const token = socket.handshake.auth?.token || cookies.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
}

/**
 * Calculate and broadcast aggregated analytics for a poll.
 * IMPORTANT: Never sends student identity data.
 */
async function broadcastAnalytics(io, sessionId, pollId) {
  const poll = await Poll.findById(pollId);
  if (!poll) return;

  const responses = await Response.find({ poll: pollId });
  const distribution = calculateDistribution(poll, responses);

  const session = await Session.findById(sessionId);
  // Participant count minus the instructor
  const totalParticipants = Math.max(0, (session?.participants?.length || 1) - 1);

  io.to(`session:${sessionId}`).emit('analytics-update', {
    pollId: poll._id,
    distribution,
    responseCount: responses.length,
    totalParticipants,
  });
}

/**
 * Close a poll (server-authoritative timer).
 * Broadcasts pulse-closed with final distribution.
 */
async function closePoll(io, sessionId, pollId) {
  const poll = await Poll.findById(pollId);
  if (!poll || !poll.isActive) return;

  poll.isActive = false;
  poll.closedAt = new Date();
  await poll.save();

  const responses = await Response.find({ poll: pollId });
  const distribution = calculateDistribution(poll, responses);

  const session = await Session.findById(sessionId);
  const totalParticipants = Math.max(0, (session?.participants?.length || 1) - 1);

  io.to(`session:${sessionId}`).emit('pulse-closed', {
    pollId: poll._id,
    distribution,
    responseCount: responses.length,
    totalParticipants,
  });

  // Clean up timer reference
  activeTimers.delete(pollId.toString());
}

/**
 * Initialize Socket.io event handlers.
 */
function initializeSocket(io) {
  // Authenticate all connections
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.name} (${socket.user.role})`);

    /**
     * JOIN SESSION
     * Validates membership, joins socket room, sends current state.
     */
    socket.on('join-session', async ({ sessionId }, callback) => {
      try {
        const session = await Session.findById(sessionId);
        if (!session || !session.isActive) {
          return callback?.({ success: false, message: 'Session not found or ended' });
        }

        const classroom = await Classroom.findById(session.classroom);
        if (!classroom) {
          return callback?.({ success: false, message: 'Classroom not found' });
        }

        // Verify user has access
        const isInstructor = session.instructor.toString() === socket.user._id.toString();
        const isStudent = classroom.students.some(
          (s) => s.toString() === socket.user._id.toString()
        );

        if (!isInstructor && !isStudent) {
          return callback?.({ success: false, message: 'You do not have access to this session' });
        }

        // Join socket room
        socket.join(`session:${sessionId}`);
        socket.sessionId = sessionId;

        // Add to participants if not already
        if (!session.participants.some((p) => p.toString() === socket.user._id.toString())) {
          session.participants.push(socket.user._id);
          await session.save();
        }

        // Broadcast participant update
        const participantCount = session.participants.length;
        io.to(`session:${sessionId}`).emit('participant-update', { count: participantCount });

        // Get current session state (active poll, etc.)
        const activePoll = await Poll.findOne({ session: sessionId, isActive: true });
        let activePollData = null;
        let hasResponded = false;

        if (activePoll) {
          // Calculate remaining time from server timestamps
          const elapsed = (Date.now() - activePoll.launchedAt.getTime()) / 1000;
          const remainingTime = Math.max(0, activePoll.timer - elapsed);

          // Check if student already responded
          if (socket.user.role === 'student') {
            const existing = await Response.findOne({
              poll: activePoll._id,
              student: socket.user._id,
            });
            hasResponded = !!existing;
          }

          // Get current analytics
          const responses = await Response.find({ poll: activePoll._id });
          const distribution = calculateDistribution(activePoll, responses);
          const totalParticipants = Math.max(0, participantCount - 1);

          activePollData = {
            _id: activePoll._id,
            question: activePoll.question,
            category: activePoll.category,
            responseType: activePoll.responseType,
            options: activePoll.options,
            timer: activePoll.timer,
            isAnonymous: activePoll.isAnonymous,
            launchedAt: activePoll.launchedAt,
            remainingTime,
            distribution,
            responseCount: responses.length,
            totalParticipants,
          };
        }

        callback?.({
          success: true,
          sessionState: {
            sessionId,
            participantCount,
            activePoll: activePollData,
            hasResponded,
          },
        });
      } catch (error) {
        console.error('join-session error:', error.message);
        callback?.({ success: false, message: 'Failed to join session' });
      }
    });

    /**
     * LAUNCH PULSE
     * Instructor-only. Creates poll, starts server timer, broadcasts to room.
     */
    socket.on('launch-pulse', async (data, callback) => {
      try {
        if (socket.user.role !== 'instructor') {
          return callback?.({ success: false, message: 'Only instructors can launch pulses' });
        }

        const { sessionId, question, responseType, options, timer, category, isAnonymous } = data;

        const session = await Session.findById(sessionId);
        if (!session || !session.isActive) {
          return callback?.({ success: false, message: 'Session not found or ended' });
        }

        if (session.instructor.toString() !== socket.user._id.toString()) {
          return callback?.({ success: false, message: 'You are not the instructor of this session' });
        }

        // Close any existing active poll
        const existingPoll = await Poll.findOne({ session: sessionId, isActive: true });
        if (existingPoll) {
          await closePoll(io, sessionId, existingPoll._id);
        }

        // Validate response type and options
        if (!['yesno', 'rating', 'choice'].includes(responseType)) {
          return callback?.({ success: false, message: 'Invalid response type' });
        }

        if (responseType === 'choice' && (!options || options.length < 2)) {
          return callback?.({ success: false, message: 'Choice questions need at least 2 options' });
        }

        const timerValue = Math.min(120, Math.max(3, timer || 10));

        // Determine options based on response type
        let pollOptions = [];
        if (responseType === 'yesno') {
          pollOptions = ['Yes', 'No'];
        } else if (responseType === 'rating') {
          pollOptions = ['1', '2', '3', '4', '5'];
        } else if (responseType === 'choice') {
          pollOptions = options;
        }

        // Create poll
        const poll = await Poll.create({
          session: sessionId,
          question,
          category: category || 'custom',
          responseType,
          options: pollOptions,
          timer: timerValue,
          isAnonymous: isAnonymous !== false,
          launchedAt: new Date(),
        });

        // Broadcast pulse to all participants
        io.to(`session:${sessionId}`).emit('pulse-launched', {
          _id: poll._id,
          question: poll.question,
          category: poll.category,
          responseType: poll.responseType,
          options: poll.options,
          timer: poll.timer,
          isAnonymous: poll.isAnonymous,
          launchedAt: poll.launchedAt,
          remainingTime: poll.timer,
        });

        // Start server-authoritative timer
        const timeoutId = setTimeout(() => {
          closePoll(io, sessionId, poll._id);
        }, timerValue * 1000);

        activeTimers.set(poll._id.toString(), timeoutId);

        callback?.({ success: true, pollId: poll._id });
      } catch (error) {
        console.error('launch-pulse error:', error.message);
        callback?.({ success: false, message: 'Failed to launch pulse' });
      }
    });

    /**
     * SUBMIT RESPONSE
     * Student-only. Validates, saves, broadcasts updated analytics.
     */
    socket.on('submit-response', async ({ pollId, answer }, callback) => {
      try {
        if (socket.user.role !== 'student') {
          return callback?.({ success: false, message: 'Only students can submit responses' });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
          return callback?.({ success: false, message: 'Poll not found' });
        }

        if (!poll.isActive) {
          return callback?.({ success: false, message: 'This pulse has already closed' });
        }

        // Validate answer matches response type
        if (poll.responseType === 'yesno' && !['Yes', 'No'].includes(answer)) {
          return callback?.({ success: false, message: 'Invalid answer. Choose Yes or No.' });
        }

        if (poll.responseType === 'rating') {
          const num = parseInt(answer);
          if (isNaN(num) || num < 1 || num > 5) {
            return callback?.({ success: false, message: 'Rating must be between 1 and 5' });
          }
        }

        if (poll.responseType === 'choice' && !poll.options.includes(answer)) {
          return callback?.({ success: false, message: 'Invalid option selected' });
        }

        // Check duplicate (application-level)
        const existing = await Response.findOne({ poll: pollId, student: socket.user._id });
        if (existing) {
          return callback?.({ success: false, message: 'You have already responded to this pulse' });
        }

        // Verify student is in the session
        const session = await Session.findById(poll.session);
        if (!session || !session.isActive) {
          return callback?.({ success: false, message: 'Session ended' });
        }

        const isParticipant = session.participants.some(
          (p) => p.toString() === socket.user._id.toString()
        );
        if (!isParticipant) {
          return callback?.({ success: false, message: 'You are not a participant in this session' });
        }

        // Save response (database-level unique index also prevents duplicates)
        await Response.create({
          poll: pollId,
          student: socket.user._id,
          answer,
          submittedAt: new Date(),
        });

        // Confirm to student
        socket.emit('response-submitted', { success: true, pollId });

        // Broadcast updated analytics to the session room
        await broadcastAnalytics(io, session._id.toString(), pollId);

        callback?.({ success: true });
      } catch (error) {
        // Handle MongoDB duplicate key error (defense in depth)
        if (error.code === 11000) {
          return callback?.({ success: false, message: 'You have already responded to this pulse' });
        }
        console.error('submit-response error:', error.message);
        callback?.({ success: false, message: 'Failed to submit response' });
      }
    });

    /**
     * END SESSION
     * Instructor-only. Closes session, clears polls/timers, broadcasts.
     */
    socket.on('end-session', async ({ sessionId }, callback) => {
      try {
        if (socket.user.role !== 'instructor') {
          return callback?.({ success: false, message: 'Only instructors can end sessions' });
        }

        const session = await Session.findById(sessionId);
        if (!session || !session.isActive) {
          return callback?.({ success: false, message: 'Session not found or already ended' });
        }

        if (session.instructor.toString() !== socket.user._id.toString()) {
          return callback?.({ success: false, message: 'You are not the instructor of this session' });
        }

        // Close active polls and clear timers
        const activePolls = await Poll.find({ session: sessionId, isActive: true });
        for (const poll of activePolls) {
          const timerId = activeTimers.get(poll._id.toString());
          if (timerId) {
            clearTimeout(timerId);
            activeTimers.delete(poll._id.toString());
          }
          poll.isActive = false;
          poll.closedAt = new Date();
          await poll.save();
        }

        session.isActive = false;
        session.endedAt = new Date();
        await session.save();

        await Classroom.findByIdAndUpdate(session.classroom, { activeSession: null });

        io.to(`session:${sessionId}`).emit('session-ended', { sessionId });

        callback?.({ success: true });
      } catch (error) {
        console.error('end-session error:', error.message);
        callback?.({ success: false, message: 'Failed to end session' });
      }
    });

    /**
     * DISCONNECT
     */
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.name}`);
    });
  });
}

module.exports = { initializeSocket };
