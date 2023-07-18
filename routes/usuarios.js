// Rutas usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

// Crear un usuario (/api/usuarios)
router.post(
	'/',
	[
		check('nombre', 'El campo nombre es obligatorio').notEmpty(),
		check('email', 'Agrega un email válido (ej: tumail@dominio.com)').isEmail(),
		check(
			'password',
			'El password debe tener al menos 6 caracteres alfanuméricos'
		).isLength({ min: 6 }),
	],
	usuarioController.crearUsuario
);

module.exports = router;
