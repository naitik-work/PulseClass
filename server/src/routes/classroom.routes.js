const router = require('express').Router();
const {
  createClassroom,
  getClassroom,
  joinClassroom,
  getInstituteClassrooms,
} = require('../controllers/classroom.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createClassroomSchema } = require('../validation/app.schemas');

router.use(authenticate);

router.post('/', authorize('instructor'), validate(createClassroomSchema), createClassroom);
router.get('/:id', getClassroom);
router.post('/:id/join', authorize('student'), joinClassroom);

module.exports = router;
