const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.js'));
router.use('/centros', require('./centers.js'));
router.use('/instalaciones', require('./facilities.js'));
router.use('/reservas', require('./bookings.js'));
router.use('/usuarios', require('./users.js'));
router.use('/admin', require('./admin.js'));
router.use('/admin-centro', require('./admin-centro.js'));

module.exports = router;
