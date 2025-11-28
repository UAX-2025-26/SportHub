const express = require('express');
const router = express.Router();
const { checkJwt, requireRole } = require('../../src/auth');
const adminCtrl = require('../../controllers/adminController.js');

router.use(checkJwt);
router.get('/resumen', requireRole('center_admin', 'admin'), adminCtrl.centerSummary);
router.get('/reservas', requireRole('center_admin', 'admin'), adminCtrl.centerBookings);

module.exports = router;
