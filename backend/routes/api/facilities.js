const express = require('express');
const router = express.Router();
const facilitiesCtrl = require('../../controllers/facilitiesController.js');
const bookingsCtrl = require('../../controllers/bookingsController.js');
const { checkJwt, requireRole } = require('../../src/auth');
const { validate } = require('../../src/validator.js');
const { createFacilitySchema, availabilityQuerySchema } = require('../../src/validation');

// availability
router.get('/:id/disponibilidad', validate(availabilityQuerySchema, 'query'), bookingsCtrl.availability);

// secured for mutations
router.use(checkJwt);
router.post('/centros/:id', requireRole('center_admin', 'admin'), validate(createFacilitySchema), facilitiesCtrl.create);
router.put('/:id', requireRole('center_admin', 'admin'), facilitiesCtrl.update);
router.delete('/:id', requireRole('center_admin', 'admin'), facilitiesCtrl.remove);

module.exports = router;
