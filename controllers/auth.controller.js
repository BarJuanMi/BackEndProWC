const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const loginGoogleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;
    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // Si no existe el usuario lo crea en la BD
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: String(process.env.PASS_DEFAULT),
                img: picture,
                google: true
            })
        } else { // Ya existe el usuario en la BD
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en BD
        await usuario.save();

        //Generar el TOKEN de JWT
        const token = await generarJWT(usuario.id);

        res.json({
            status: true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            msg: 'Token de Google Invalido'
        });
    }
}

module.exports = {
    login,
    loginGoogleSignIn
}