const { response } = require('express');
const Retiro = require('../models/retiro.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * 
 * @param {*} req 
 * @param {*} res 
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
 * 
 * @param {*} req 
 * @param {*} res 
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
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarRetiro = async(req, res = repsonse) => {
    const uid = req.uid;
    try {
        const idRetiro = req.params.id;

        console.log(idRetiro);

        const resRetiroDB = await Retiro.findById(idRetiro);

        if (!resRetiroDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el retiro con ese id'
            });
        }

        req.body.fechaFirma = '' + new Date();

        const { modelo, usuarioCreacion, motivoRetiro, fechaRenuncia, ...campos } = req.body;

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
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const buscarRetiroPorId = async(req, res = response) => {
    const idRetiro = req.params.id;

    try {
        const retiroRet = await Retiro.findById(idRetiro);


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
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
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