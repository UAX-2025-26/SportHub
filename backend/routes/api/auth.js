const express = require('express');
const router = express.Router();
const authCtrl = require('../../controllers/authController');

// POST /api/auth/login - Iniciar sesión
router.post('/login', authCtrl.login);

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', authCtrl.register);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authCtrl.logout);

module.exports = router;

