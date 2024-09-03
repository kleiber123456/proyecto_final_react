const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

// Definición de rutas
router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/', actualizar);
router.delete('/', eliminar);

// Controladores de las rutas
async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const result = await controlador.agregar(req.body);
        const mensaje = req.body.id === 0 ? 'Item guardado' : 'Item actualizado';
        respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const result = await controlador.agregar(req.body); // Considera actualizar con el método correcto
        const mensaje = 'Item actualizado';
        respuesta.success(req, res, mensaje, 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        const result = await controlador.eliminar(req.body.id); // Asegúrate de que `req.body.id` sea el parámetro correcto
        respuesta.success(req, res, 'Item eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router; // Asegúrate de exportar el router aquí
