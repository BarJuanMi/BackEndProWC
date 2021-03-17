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

//Rutas
app.use('/api/usuarios', require('./routes/usuarios.route'));
app.use('/api/login', require('./routes/auth.route'))


app.listen(process.env.PORT_EXP, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT_EXP);
});