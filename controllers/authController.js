const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
	// Revisar si hay errores de validación
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	// Extraer el email y el password
	const { email, password } = req.body;

	try {
		// Verificar que sea un email registrado
		let usuario = await Usuario.findOne({ email });
		if (!usuario) {
			return res
				.status(400)
				.json({ message: 'El email no ha sido registrado' });
		}

		// Revisar el password
		const passwordCorrecto = await bcrypt.compare(password, usuario.password);
		if (!passwordCorrecto) {
			return res.status(400).json({ message: 'Contraseña incorrecta' });
		}

		// Crear y firmar el JWT
		const payload = {
			usuario: {
				id: usuario.id,
			},
		};

		// Firmar el JWT
		jwt.sign(
			payload,
			process.env.SECRET,
			{
				expiresIn: 3600, // 1 hr
			},
			(error, token) => {
				if (error) throw error;

				// Mensaje de confirmación
				res.json({ token });
			}
		);
	} catch (error) {
		console.log(error);
	}
};

// Obtiene qué usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.usuario.id).select('-password'); // Notación de Mongoose para excluir datos, ej: .select('-value')
		res.json({ usuario });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Ha habido un error' });
	}
};
