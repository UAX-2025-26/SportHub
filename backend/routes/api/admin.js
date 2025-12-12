const express = require('express');
const router = express.Router();
const { checkJwt, requireRole } = require('../../src/auth');
const adminCtrl = require('../../controllers/adminController.js');

// Middleware de logging para depuración
router.use((req, res, next) => {
  console.log('[ADMIN ROUTE]', new Date().toISOString(), req.method, req.path);
  console.log('[AUTH HEADER]', req.headers.authorization ? 'Present' : 'Missing');
  next();
});

router.use(checkJwt);

// center admin - gestión de su propio centro
router.get('/mi-centro', requireRole('center_admin'), adminCtrl.getMyCenterData);
router.get('/centro/resumen', requireRole('center_admin', 'admin'), adminCtrl.centerSummary);
router.get('/centro/reservas', requireRole('center_admin', 'admin'), adminCtrl.centerBookings);

// global admin
router.get('/estadisticas', requireRole('admin'), adminCtrl.adminStats);
router.post('/promociones', requireRole('admin'), adminCtrl.createPromotion);
router.get('/centros', requireRole('admin'), adminCtrl.listCenters);
router.get('/usuarios/:id', requireRole('admin'), adminCtrl.getUserById);
router.put('/usuarios/:id', requireRole('admin'), adminCtrl.updateUserById);

module.exports = router;
