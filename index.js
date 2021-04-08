require('dotenv').config();

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura y Parseo del Body
app.use(express.json());

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

app.use('/api/modelos', require('./routes/modelos.route'));


app.listen(process.env.PORT_EXP, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT_EXP);
});