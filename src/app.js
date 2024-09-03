const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config'); // Asegúrate de que esta ruta sea correcta

const clientes = require('./modulos/clientes/rutas');
const proveedores = require('./modulos/proveedores/rutas'); // Asegúrate de que esta ruta sea correcta
const compras = require('./modulos/compras/rutas');
const productoservicio = require('./modulos/productoservicio/rutas');
const ventas = require('./modulos/ventas/rutas');
const error = require('./red/errors');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
    origin: '*', // Permite todas las solicitudes de cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Configuración del puerto
app.set('port', config.app.port || 4000); // Establece un puerto predeterminado si config.app.port no está definido

// Rutas
app.use('/api/clientes', clientes);
app.use('/api/proveedores', proveedores);
app.use('/api/compras', compras);
app.use('/api/productoservicio', productoservicio);
app.use('/api/ventas', ventas);

// Manejo de errores
app.use(error);

module.exports = app;
