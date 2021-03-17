const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //Verificar email
        const resUsuarioDB = await Usuario.findOne({ email });
        if (!resUsuarioDB) {
            return res.status(400).json({
                status: false,
                msg: 'Credenciales de acceso incorrectas'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, resUsuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                status: false,
                msg: 'Credenciales de acceso incorrectas'
            });
        }

        //Generar el TOKEN de JWT
        const token = await generarJWT(resUsuarioDB.id);

        res.json({
            status: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la autenticación del Usuario - Ver logs'
        });
    }
}

module.exports = {
    login
}