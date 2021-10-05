const { response } = require('express');
const Retiro = require('../models/retiro.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los usuarios usando el desde como 
 * condicion inical de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getRetiros = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 15 en adelante, recordar que le numeracion comienza en 0

    const [retiros, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Retiro.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('modelo', 'documento nombres apellidos')
        .populate('usuarioCreacion', 'nombre')
        .populate('usuarioCargoPDF', 'nombre')
        .sort({ fechaRenuncia: -1 })
        .limit(Number(process.env.LIMIT_QUERY_RETIRO)),

        //Promesa 2
        Retiro.countDocuments()
    ]);

    res.json({
        status: true,
        retiros,
        total
    })
}

/**
 * Operación para crear un nuevo retiro dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRetiro = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const retiroNew = new Retiro({
            usuarioCreacion: uid,
            ...req.body
        });
        retiroNew.fechaRenuncia = addHoursDate(req.body.fechaRenuncia)

        const retiroRet = await retiroNew.save();

        res.json({
            status: true,
            retiroRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación de Retiro - Ver logs'
        });
    }
}

/**
 * Operación para actualizar el retiro dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const actualizarRetiro = async(req, res = response) => {
    const uid = req.uid;
    try {
        const idRetiro = req.params.id;

        const resRetiroDB = await Retiro.findById(idRetiro);

        if (!resRetiroDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el retiro con ese id'
            });
        }

        const estadoAux = req.body.estadoCargoPDF;

        if (estadoAux === undefined) {
            req.body.estado = 'FIRMADO';
        }

        const {
            modelo,
            usuarioCreacion,
            motivoRetiro,
            fechaRegistro,
            encuesta,
            entrevista,
            fechaRenuncia,
            usuarioCargoPDF,
            fechaCargoPDF,
            pathPDF,
            estadoCargoPDF,
            ...campos
        } = req.body;

        const retiroActualizado = await Retiro.findByIdAndUpdate(idRetiro, campos, { new: true });

        res.json({
            status: true,
            retiro: retiroActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la actualización del Retiro - Ver logs'
        });
    }
}

/**
 * Operación para obtener un retiro mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarRetiroPorId = async(req, res = response) => {
    const idRetiro = req.params.id;

    try {
        const retiroRet = await Retiro
            .findById(idRetiro)
            .populate('modelo', 'documento nombres apellidos')
            .populate('usuarioCreacion', 'nombre')
            .populate('usuarioCargoPDF', 'nombre');

        if (!retiroRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el retiro con ese id'
            });
        }

        res.json({
            status: true,
            retiro: retiroRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular del retiro - Ver logs'
        });
    }
}

/**
 * Operación para eliminar fisicamente un retiro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const eliminarRetiro = async(req, res = response) => {
    const idRetiro = req.params.id;

    try {
        const resRetiroDB = await Retiro.findById(idRetiro);

        if (!resRetiroDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el retiro con ese id'
            });
        }

        const retiroEliminado = await Retiro.findByIdAndDelete(idRetiro);

        res.json({
            status: true,
            msg: 'Retiro eliminado correctamente',
            retiro: retiroEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Retiro - Ver logs'
        });
    }
}

module.exports = {
    crearRetiro,
    getRetiros,
    actualizarRetiro,
    buscarRetiroPorId,
    eliminarRetiro
}