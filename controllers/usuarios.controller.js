const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

/**
 * Metodo para obtener todos los usuarios usando el dfesde como 
 * condicion inical de busqueda hasta el final de la coleccion.
 * @param {*} req 
 * @param {*} res 
 */
const getUsuarios = async(req, res = response) => {

    //Si no manda el desde en el path, pone 0
    const desde = Number(req.query.desde) || 0;

    console.log(desde);

    //Collecion de promesas que se ejecutan simultaneamente
    //separadas por una coma dentro del arreglo
    const [usuarios, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Usuario.find({}, 'nombre email role google img')
        .skip(desde) //se salta lo registros antes del desde (posicion en collecion)
        .sort({ nombre: 1 })
        .limit(Number(process.env.LIMIT_QUERY)),

        //Promesa 2
        Usuario.countDocuments()
    ]);

    res.json({
        status: true,
        usuarios,
        total
    })
}

/**
 * Metodo para crear un nuevo usuario
 * @param {*} req 
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

/**
 * Metodo para actualizar la informacion de un usuario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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

        // Deconstruyo el request en sus objetos que componen el json y los pongo en la varaible campos
        // pero cosas como el password y google no se van a actualizar, aunque le envie valores nuevos en la peticion
        const { password, google, ...campos } = req.body;

        /*if ( resUsuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email});
            if( existeEmail ) {
                return res.status(400).json({
                    status: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if( !resUsuarioDB.google ){
            campos.email = email;
        } else if (resUsuarioDB.email !== email) {
            return res.status(400).json({
                status: false,
                msg: 'Usuario de google no puede cambiar su correo';
            });
        }    
        */

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

/**
 * Metodo para eliminar fisicamente un usuario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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
            msg: 'Usuario eliminado correctamente',
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