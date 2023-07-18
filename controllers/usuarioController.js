const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
	// Revisar si hay errores de validación
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	// Extraer email y password
	const { email, password } = req.body;

	try {
		// Validar que el usuario no esté ya registrado
		let usuario;
		usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({ message: 'Este usuario ya existe' });
		}

		// Crear nuevo usuario
		usuario = new Usuario(req.body);

		// Hashear el password
		const salt = await bcrypt.genSalt(10);
		usuario.password = await bcrypt.hash(password, salt);

		// Guardar nuevo usuario
		await usuario.save();

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
		res.status(400).send('Ocurrió un error al crear el usuario');
	}
};
