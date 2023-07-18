// Rutas de autenticación
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Iniciar sesión (/api/auth)
router.post(
	'/',
	authController.autenticarUsuario
);

// Obtiene el usuario autenticado
router.get(
	'/',
	auth,
	authController.usuarioAutenticado
)

module.exports = router;
