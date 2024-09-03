// Importa el módulo de base de datos
const db = require('../../DB/mysql');

// Importa el controlador
const ctrl = require('./controlador');

// Crea y exporta el controlador con la base de datos inyectada
module.exports = ctrl(db);

