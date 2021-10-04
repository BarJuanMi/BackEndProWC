const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

/**
 * Operación para obtener todos los usuarios usando el desde como 
 * condicion inical de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getUsuarios = async(req, res = response) => {

    //Si no manda el desde en el path, pone 0
    const desde = Number(req.query.desde) || 0;

    console.log('desde:' + desde);

    //Collecion de promesas que se ejecutan simultaneamente
    //separadas por una coma dentro del arreglo
    const [usuarios, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Usuario.find({}, 'nombre email role google img estado fechaCreacion')
        .skip(desde) //se salta lo registros antes del desde (posicion en collecion)
        .sort({ fechaCreacion: 1 })
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
 * Operación para crear un nuevo usuario mediante el formulario de registro
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearUsuarioPorRegister = async(req, res = response) => {

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
 * Operación para crear un nuevo usuario mediante el formulario interno de la APP
 * debe ser creado siempre y cuando el usuario sea de tipo ADMIN_ROLE 
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearUsuarioPorApp = async(req, res = response) => {
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

        res.json({
            status: true,
            usuario
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
 * Operación para actualizar la informacion de un usuario
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
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
 * Operación para eliminar fisicamente un usuario
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
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
    crearUsuarioPorRegister,
    crearUsuarioPorApp,
    actualizarUsuario,
    eliminarUsuario
}