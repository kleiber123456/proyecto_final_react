const TABLA = 'productoservicio';  // Asegúrate de que el nombre de la tabla sea correcto

module.exports = function(dbInyectada) {
    let db = dbInyectada;

    // Si no se pasa un db, se usa el módulo por defecto
    if (!db) {
        db = require('../../DB/mysql');
    }

    // Obtener todos los registros de la tabla
    function todos() {
        return db.todos(TABLA);
    }

    // Obtener un registro por id
    function uno(id) {
        return db.uno(TABLA, id);
    }

    // Agregar un nuevo registro
    function agregar(body) {
        return db.agregar(TABLA, body);
    }

    // Eliminar un registro por id
    function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return {
        todos,
        uno,
        agregar,
        eliminar
    };
};