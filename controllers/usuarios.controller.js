const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

/**
 * 
 * @param {Metodo para obtener todos los usuarios} req 
 * @param {*} res 
 */
const getUsuarios = async(req, res) => {

    //Los filtros de los campos a mostrar se 
    // controlan desde el modelo
    const usuarios = await Usuario.find({});
    res.json({
        status: true,
        usuarios
    })
}

/**
 * 
 * @param {Metodo paraa crear un nuevo usuario} req 
 * @param {*} res 
 * @returns 
 */
const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //Se validara que no exista un usuario con el mismo email
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                status: false,
                msg: 'Este email ya se encuentra registrado'
            })
        }

        const usuario = new Usuario(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //El await es para que la promesa de salvado
        //termine antes de retornare el res
        await usuario.save();

        //Generar el TOKEN de JWT
        const token = await generarJWT(usuario.id);

        res.json({
            status: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del Usuario - Ver logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // TODO: Validar token y el role usuario 

        const resUsuarioDB = await Usuario.findById(uid);

        if (!resUsuarioDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el usuario con ese id'
            });
        }

        // Si el body del update trajera todos los tags con su valor 
        // lo que hago es eliminarlos del objeto serializado campos
        // para que eso no viaje al update del documento en BD
        const { password, google, email, role, ...campos } = req.body;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            status: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualización del Usuario - Ver logs'
        });
    }
}

const eliminarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // TODO: Validar token y el role usuario 

        const resUsuarioDB = await Usuario.findById(uid);

        if (!resUsuarioDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el usuario con ese id'
            });
        }

        const usuarioEliminado = await Usuario.findByIdAndDelete(uid);

        res.json({
            status: true,
            usuario: usuarioEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Usuario - Ver logs'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}