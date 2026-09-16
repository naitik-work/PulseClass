const router = require('express').Router();
const {
  startSession,
  getSession,
  endSession,
  getSessionReport,
  getClassroomSessions,
} = require('../controllers/session.controller');
const { getInstituteClassrooms } = require('../controllers/classroom.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { startSessionSchema } = require('../validation/app.schemas');

router.use(authenticate);

router.post('/start', authorize('instructor'), validate(startSessionSchema), startSession);
router.get('/:id', getSession);
router.post('/:id/end', authorize('instructor'), endSession);
router.get('/:id/report', authorize('instructor'), getSessionReport);

module.exports = router;
