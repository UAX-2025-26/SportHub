const express = require('express');
const router = express.Router();
const centersCtrl = require('../../controllers/centersController.js');
const facilitiesCtrl = require('../../controllers/facilitiesController.js');
const { requireRole, checkJwt } = require('../../src/auth');
const { validate } = require('../../src/validator.js');
const { createCenterSchema, createFacilitySchema } = require('../../src/validation');

router.get('/', centersCtrl.list);
router.get('/:id', centersCtrl.detail);
router.get('/:id/instalaciones', facilitiesCtrl.listByCenter);

router.use(checkJwt);
router.post('/', requireRole('center_admin', 'admin'), validate(createCenterSchema), centersCtrl.create);
router.put('/:id', requireRole('center_admin', 'admin'), centersCtrl.update);
router.delete('/:id', requireRole('center_admin', 'admin'), centersCtrl.deletCenter);
router.post('/:id/instalaciones', requireRole('center_admin', 'admin'), validate(createFacilitySchema), facilitiesCtrl.create);

module.exports = router;
