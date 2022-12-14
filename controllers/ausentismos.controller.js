const { response } = require('express');
const Ausentismo = require('../models/ausentismo.model');
const TipoAusentismo = require('../models/tipoausentismo.model');
const Empleado = require('../models/empleado.model');
const Usuario = require('../models/usuario.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los ausentismos usando el desde como 
 * condicion inicial de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getAusentismos = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 10 en adelante, recordar que le numeracion comienza en 0
    const [ausentismos, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Ausentismo.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('empleado', 'documento nombApellConca')
        .populate('usuarioRegistro', 'nombre')
        .populate('usuarioAprobRecha', 'nombre')
        .populate('tipoAusentismo', 'tipoausentismoDesc')
        .sort({ fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_AUSENTISMOS)),

        //Promesa 2
        Ausentismo.countDocuments()
    ]);

    res.json({
        status: true,
        ausentismos,
        total
    })
}

/**
 * Operación para crear un nuevo ausentismo dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegAusentismo = async(req, res = response) => {

    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        req.body.usuario = uid;

        const ausentismoNew = new Ausentismo({
            usuarioRegistro: uid,
            ...req.body
        });

        const idEmpleadoDB = await Empleado.findById(req.body.empleado);

        const tipoAusentismo = await TipoAusentismo.findById(req.body.tipo);

        ausentismoNew.estado = 'CREADO SIN SOPORTE';
        ausentismoNew.fechaInicio = addHoursDate(req.body.fechaInicio);
        ausentismoNew.fechaFinalizacion = addHoursDate(req.body.fechaFinalizacion);
        ausentismoNew.emplNomApel = String(idEmpleadoDB.nombres).toUpperCase() + ' ' + String(idEmpleadoDB.apellidos).toUpperCase();
        ausentismoNew.tipoAusentismo = tipoAusentismo._id;

        if (ausentismoNew.fechaFinalizacion < ausentismoNew.fechaInicio) {
            ausentismoNew.fechaFinalizacion = ausentismoNew.fechaInicio;
        }

        const ausentismoRet = await ausentismoNew.save();

        res.json({
            status: true,
            ausentismoRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la creación del registro de ausentismo - Ver logs'
        });
    }
}

/**
 * Operación para obtener un ausentismo mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarRegAusentismoId = async(req, res = response) => {

    const idAusentismo = req.params.id;
    try {
        const ausentismoRet = await Ausentismo
            .findById(idAusentismo)
            .populate('empleado', 'documento nombApellConca')
            .populate('usuarioRegistro', 'nombre')
            .populate('usuarioAprobRecha', 'nombre')
            .populate('usuarioCargoPDF', 'nombre')
            .populate('tipoAusentismo', 'tipoausentismoDesc')

        if (!ausentismoRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de ausentismo con ese id'
            });
        }

        res.json({
            status: true,
            ausentismo: ausentismoRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la busqueda particular del registro de ausentismo - Ver logs'
        });
    }
}

/**
 * Operación para actualizar el ausentismo dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const actualizarRegAusentismo = async(req, res = response) => {

    const uid = req.uid;
    const idAusentismo = req.params.id;
    try {
        const resAusentismoDB = await Ausentismo.findById(idAusentismo);

        if (!resAusentismoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de ausentismo con ese id'
            });
        }

        req.body.usuarioAprobRecha = uid;
        const {...campos } = req.body;

        const ausentismoActualizado = await Ausentismo.findByIdAndUpdate(idAusentismo, campos, { new: true });

        res.json({
            status: true,
            ausentismo: ausentismoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualizacion del registro de ausentismo - Ver logs'
        });
    }
}

/**
 * Operación para eliminar fisicamente un ausentismo del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const eliminarRegAusentismo = async(req, res = response) => {

    const idAusentismo = req.params.id;
    try {
        const resAusentismoDB = await Ausentismo.findById(idAusentismo);

        if (!resAusentismoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de ausentismo con ese id'
            });
        }

        const ausentismoEliminado = await Ausentismo.findByIdAndDelete(idAusentismo);

        res.json({
            status: true,
            msg: 'Registro de ausentismo eliminado correctamente',
            ausentismo: ausentismoEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del registro de ausentismo - Ver logs'
        });
    }
}

module.exports = {
    getAusentismos,
    crearRegAusentismo,
    buscarRegAusentismoId,
    actualizarRegAusentismo,
    eliminarRegAusentismo
}