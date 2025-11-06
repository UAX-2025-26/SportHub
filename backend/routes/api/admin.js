const express = require('express');
const router = express.Router();
const { checkJwt, requireRole } = require('../../src/auth');
const adminCtrl = require('../../controllers/adminController.js');

router.use(checkJwt);

// center admin
router.get('/centro/resumen', requireRole('center_admin', 'admin'), adminCtrl.centerSummary);
router.get('/centro/reservas', requireRole('center_admin', 'admin'), adminCtrl.centerBookings);

// global admin
router.get('/estadisticas', requireRole('admin'), adminCtrl.adminStats);
router.post('/promociones', requireRole('admin'), adminCtrl.createPromotion);
router.get('/centros', requireRole('admin'), adminCtrl.listCenters);
router.get('/usuarios/:id', requireRole('admin'), adminCtrl.getUserById);
router.put('/usuarios/:id', requireRole('admin'), adminCtrl.updateUserById);

module.exports = router;
