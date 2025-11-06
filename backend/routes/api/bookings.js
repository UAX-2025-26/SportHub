const express = require('express');
const router = express.Router();
const { checkJwt } = require('../../src/auth');
const bookingsCtrl = require('../../controllers/bookingsController.js');
const { validate } = require('../../src/validator.js');
const { createBookingSchema } = require('../../src/validation');

router.use(checkJwt);
router.post('/', validate(createBookingSchema), bookingsCtrl.create);
router.get('/', bookingsCtrl.list);
router.delete('/:id', bookingsCtrl.cancel);

module.exports = router;
