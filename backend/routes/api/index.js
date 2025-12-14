const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.js'));
router.use('/centros', require('./centers.js'));
router.use('/centers', require('./centers.js')); // Alias para API consistency
router.use('/instalaciones', require('./facilities.js'));
router.use('/facilities', require('./facilities.js')); // Alias para API consistency
router.use('/reservas', require('./bookings.js'));
router.use('/bookings', require('./bookings.js')); // Alias para API consistency
router.use('/usuarios', require('./users.js'));
router.use('/admin', require('./admin.js'));
router.use('/admin-centro', require('./admin-centro.js'));

module.exports = router;
