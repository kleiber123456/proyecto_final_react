const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const clientes = require('./modulos/clientes/rutas');
const proveedores = require('./modulos/Proveedores/rutas'); // Asegúrate de que esta ruta sea correcta
const compras = require('./modulos/compras/rutas');
const productoservicio = require('./modulos/productoservicio/rutas');
const ventas = require('./modulos/ventas/rutas');
const error = require('./red/errors');


const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración
app.set('port', config.app.port);

// Rutas
app.use('/api/clientes', clientes);
app.use('/api/proveedores', proveedores); // Asegúrate de que esta ruta esté correcta
app.use('/api/compras', compras);
app.use('/api/productoservicio', productoservicio);
app.use('/api/ventas', ventas);
// Manejo de errores
app.use(error);

module.exports = app;
