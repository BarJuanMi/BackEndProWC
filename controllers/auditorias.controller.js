const { response } = require('express');
const Auditoria = require('../models/auditoria.model');
const Empleado = require('../models/empleado.model');
const Usuario = require('../models/usuario.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los ausentismos usando el desde como 
 * condicion inicial de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getAuditorias = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 10 en adelante, recordar que le numeracion comienza en 0
    const [auditorias, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Auditoria.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('usuarioResponsable', 'nombre')
        .sort({ fechaOperacion: -1 })
        .limit(Number(process.env.LIMIT_QUERY_AUSENTISMOS)),

        //Promesa 2
        Auditoria.countDocuments()
    ]);

    res.json({
        status: true,
        auditorias,
        total
    })
}

/**
 * Operación para crear un nuevo auditoria dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegAuditoria = async(req, res = response) => {

    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        req.body.usuario = uid;

        const auditoriaNew = new Auditoria({
            usuarioResponsable: uid,
            ...req.body
        });

        const auditoriaRet = await auditoriaNew.save();

        res.json({
            status: true,
            auditoriaRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la creación del registro de auditoria - Ver logs'
        });
    }
}

module.exports = {
    getAuditorias,
    crearRegAuditoria
}