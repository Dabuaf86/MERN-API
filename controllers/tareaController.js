const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
	// Revisar si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	try {
		// Extraer el proyecto y comprobar si existe
		const { proyecto } = req.body;
		const proyectoEncontrado = await Proyecto.findById(proyecto);
		if (!proyectoEncontrado) {
			return res.status(404).json({ message: 'Proyecto no válido' });
		}

		// Revisar si el proyecto actual pertenece al usuario autenticado
		if (proyectoEncontrado.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ message: 'Usuario no válido' });
		}

		// Crear la tarea
		const tarea = new Tarea(req.body);
		await tarea.save();
		res.json({ tarea });
	} catch (error) {
		console.log(error);
		res.status(500).send('Ha ocurrido un error');
	}
};

// Obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {
	try {
		// Extraer el proyecto y comprobar si existe
		const { proyecto } = req.body;
		const proyectoEncontrado = await Proyecto.findById(proyecto);
		if (!proyectoEncontrado) {
			return res.status(404).json({ message: 'Proyecto no válido' });
		}

		// Revisar si el proyecto actual pertenece al usuario autenticado
		if (proyectoEncontrado.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ message: 'Usuario no válido' });
		}

		// Obtener las tareas del proyecto
		const tareas = await Tarea.find({ proyecto });
		res.json({ tareas });
	} catch (error) {
		console.log(error);
		res.status(500).send('Ha ocurrido un error');
	}
};

// Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
	try {
		// Extraer el proyecto y comprobar si existe
		const { proyecto, nombre, estado } = req.body;

		// Revisar si la tarea existe o no
		let tarea = await Tarea.findById(req.params.id);
		if (!tarea) {
			return res.status(404).json({ message: 'La tarea no existe' });
		}

		// Revisar si el proyecto existe o no
		const proyectoEncontrado = await Proyecto.findById(proyecto);

		// Revisar si el proyecto actual pertenece al usuario autenticado
		if (proyectoEncontrado.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ message: 'Usuario no válido' });
		}

		// Crear un objeto con la nueva información
		const nuevaTarea = {};
		if (nombre) nuevaTarea.nombre = nombre;
		if (estado) nuevaTarea.estado = estado;

		// Guardar la tarea modificada
		tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
			new: true,
		});
		res.json({ tarea });
	} catch (error) {
		console.log(error);
		res.status(500).send('Ha ocurrido un error');
	}
};

// Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
	try {
		// Extraer el proyecto y comprobar si existe
		const { proyecto } = req.body;

		// Revisar si la tarea existe o no
		let tarea = await Tarea.findById(req.params.id);
		if (!tarea) {
			return res.status(404).json({ message: 'La tarea no existe' });
		}

		// Revisar si el proyecto existe o no
		const proyectoEncontrado = await Proyecto.findById(proyecto);

		// Revisar si el proyecto actual pertenece al usuario autenticado
		if (proyectoEncontrado.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ message: 'Usuario no válido' });
		}

		// Eliminar la tarea
		await Tarea.findByIdAndRemove({ _id: req.params.id });
		res.json({ message: 'Tarea eliminada' });
	} catch (error) {
		console.log(error);
		res.status(500).send('Ha ocurrido un error');
	}
};
