const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
require('dotenv').config({ path: 'variables.env' });

// Crear el servidor
const app = express();

// Conectar con la DB
conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

// Puerto de la app
const PORT = process.env.PORT || 3001;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// Arrancar la app
app.listen(PORT, () => {
	console.log(`Servidor funcionando en el puerto ${PORT}`);
});
