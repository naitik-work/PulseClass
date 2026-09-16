const router = require('express').Router();
const { pulseTemplates, pulseCategories } = require('../data/pulseTemplates');

/**
 * GET /api/pulses/templates — Get all FAQ pulse templates
 * Public route — no auth required, templates are not sensitive
 */
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    templates: pulseTemplates,
    categories: pulseCategories,
  });
});

module.exports = router;
