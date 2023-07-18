const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const conectarDB = async () => {
	try {
		await mongoose.connect(process.env.DB_NAME, {});
	} catch (error) {
		console.log(error);
		process.exit(1); // Detener la app
	}
};

module.exports = conectarDB;
