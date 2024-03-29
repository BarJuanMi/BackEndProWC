require('dotenv').config();

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
//const docs = require('./docs');
const swaggerUI = require("swagger-ui-express");

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    app.options('*', (req, res) => {
        // allowed XHR methods
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

//Lectura y Parseo del Body
app.use(express.json());

//Aplicacion de logger
//app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

//Conexion a Base de datos
dbConnection();

//Directorio publico
app.use(express.static('public'));

//Rutas
app.use('/api/usuarios', require('./routes/usuarios.route'));
app.use('/api/login', require('./routes/auth.route'));
app.use('/api/hospitales', require('./routes/hospitales.route'));
app.use('/api/medicos', require('./routes/medicos.route'));
app.use('/api/busqueda', require('./routes/busqueda.route'));
app.use('/api/files/uploads', require('./routes/uploads.route'));
app.use('/api/files/uploadspdf', require('./routes/uploadspdf.route'));

app.use('/api/empleados', require('./routes/empleados.route'));
app.use('/api/aspirantes', require('./routes/aspirantes.route'));

app.use('/api/prestamos', require('./routes/prestamos.route'));
app.use('/api/retiros', require('./routes/retiros.route'));
app.use('/api/vacunados', require('./routes/vacunados.route'));
app.use('/api/pqrs', require('./routes/pqrsincidentes.route'));
app.use('/api/lavanderias', require('./routes/servlavanderias.route'));

app.use('/api/utiles', require('./routes/utiles.route'));
app.use('/api/ausentismos', require('./routes/ausentismos.route'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});