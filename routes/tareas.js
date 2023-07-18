const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear tareas (/api/tareas)
router.post(
	'/',
	auth,
	[check('nombre', 'El nombre de la tarea es obligatorio').notEmpty()],
	[check('proyecto', 'El proyecto es obligatorio').notEmpty()],
	tareaController.crearTarea
);

// Obtener los tareas por proyecto (/api/tareas)
router.get('/', auth, tareaController.obtenerTareas);

// Actualizar una tarea por ID (/api/tareas)
router.put(
	'/:id',
	auth,
	[check('nombre', 'El nombre de la tarea es obligatorio').notEmpty()],
	tareaController.actualizarTarea
);

// Eliminar un tarea por ID (/api/tareas)
router.delete('/:id', auth, tareaController.eliminarTarea);

module.exports = router;
