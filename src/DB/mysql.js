const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

let conexion;

function conMysql() {
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if (err) {
            console.error('[db err]', err);
            setTimeout(conMysql, 2000);  // Intenta reconectar después de 2 segundos
        } else {
            console.log('Conectado a la base de datos!!!');
            createTables(); // Llamar a la función para crear las tablas una vez conectados
        }
    });

    conexion.on('error', err => {
        console.error('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql();  // Reconectar si se pierde la conexión
        } else {
            throw err;
        }
    });
}

conMysql();

function createTables() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS Proveedores (
            ProveedorID INT AUTO_INCREMENT PRIMARY KEY,
            Nombre VARCHAR(255) NOT NULL,
            Apellido VARCHAR(255) NOT NULL,
            Correo VARCHAR(255) NOT NULL UNIQUE,
            Telefono VARCHAR(20),
            Direccion TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS Clientes (
            ClienteID INT AUTO_INCREMENT PRIMARY KEY,
            Nombre VARCHAR(255) NOT NULL,
            Apellido VARCHAR(255) NOT NULL,
            Correo VARCHAR(255) NOT NULL UNIQUE,
            Telefono VARCHAR(20)
        )`,
        `CREATE TABLE IF NOT EXISTS ProductoServicio (
            ProductoServicioID INT AUTO_INCREMENT PRIMARY KEY,
            Nombre VARCHAR(255) NOT NULL,
            Descripcion TEXT,
            Precio DECIMAL(10, 2) NOT NULL,
            Tipo ENUM('Producto', 'Servicio') NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS Compras (
            CompraID INT AUTO_INCREMENT PRIMARY KEY,
            ProveedorID INT,
            FechaCompra DATE NOT NULL,
            Total DECIMAL(10, 2) NOT NULL,
            ProductoServicioID INT,
            FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID),
            FOREIGN KEY (ProductoServicioID) REFERENCES ProductoServicio(ProductoServicioID)
        )`,
        `CREATE TABLE IF NOT EXISTS Ventas (
            VentaID INT AUTO_INCREMENT PRIMARY KEY,
            ClienteID INT,
            FechaVenta DATE NOT NULL,
            Total DECIMAL(10, 2) NOT NULL,
            ProductoServicioID INT,
            FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID),
            FOREIGN KEY (ProductoServicioID) REFERENCES ProductoServicio(ProductoServicioID)
        )`
    ];

    queries.forEach(query => {
        conexion.query(query, (err, results) => {
            if (err) {
                console.error('Error al crear la tabla:', err);
            } else {
                console.log('Tabla creada o ya existente');
            }
        });
    });
}

// Funciones para manejar datos
function todos(tabla) {
    return new Promise((resolver, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolver(result);
        });
    });
}

function uno(tabla, id) {
    const idColumn = getIdColumn(tabla);
    return new Promise((resolver, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE ${idColumn} = ?`, [id], (error, result) => {
            return error ? reject(error) : resolver(result);
        });
    });
}

function insertar(tabla, data) {
    return new Promise((resolver, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolver(result);
        });
    });
}

function actualizar(tabla, data) {
    const idColumn = getIdColumn(tabla);
    return new Promise((resolver, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE ${idColumn} = ?`, [data, data[idColumn]], (error, result) => {
            return error ? reject(error) : resolver(result);
        });
    });
}

function agregar(tabla, data) {
    if (data && data[getIdColumn(tabla)] === 0) {
        return insertar(tabla, data);
    } else {
        return actualizar(tabla, data);
    }
}

function eliminar(tabla, data) {
    const idColumn = getIdColumn(tabla);
    return new Promise((resolver, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE ${idColumn} = ?`, [data[idColumn]], (error, result) => {
            return error ? reject(error) : resolver(result);
        });
    });
}

function getIdColumn(tabla) {
    switch (tabla) {
        case 'proveedores':
            return 'ProveedorID';
        case 'clientes':
            return 'ClienteID';
        case 'productoservicio':
            return 'ProductoServicioID';
        case 'compras':
            return 'CompraID';
        case 'ventas':
            return 'VentaID';
        default:
            throw new Error('Tabla desconocida');
    }
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    createTables
};
