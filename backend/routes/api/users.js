const express = require('express');
const router = express.Router();
const { checkJwt } = require('../../src/auth');
const usersCtrl = require('../../controllers/usersController.js');

router.use(checkJwt);
router.get('/me', usersCtrl.me);
router.put('/me', usersCtrl.updateMe);

module.exports = router;
