const router = require('express').Router();
const {
  createInstitute,
  getInstitutes,
  getInstitute,
  joinInstitute,
} = require('../controllers/institute.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createInstituteSchema, joinInstituteSchema } = require('../validation/app.schemas');

// All institute routes require authentication
router.use(authenticate);

router.post('/', authorize('instructor'), validate(createInstituteSchema), createInstitute);
router.get('/', getInstitutes);
router.get('/:id', getInstitute);
router.post('/join', validate(joinInstituteSchema), joinInstitute);

module.exports = router;
