const { response } = require('express');
const PQRSIncidente = require('../models/pqrsincidente.model');
const Modelo = require('../models/modelo.model');
const Usuario = require('../models/usuario.model');
const TipoPQRS = require('../models/tipopqrs.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los incidentes y pqrs usando el desde como 
 * condicion inical de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getPQRS = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 15 en adelante, recordar que le numeracion comienza en 0

    const [pqrsi, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        PQRSIncidente.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('modeloAsociado', 'documento nombres apellidos')
        .populate('usuarioRegistro', 'nombre')
        .populate('usuarioAsignado', 'nombre')
        .populate('tipo', 'tipopqrsDesc')
        .sort({ prioridad: 1, fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_PQRS)),

        //Promesa 2
        PQRSIncidente.countDocuments()
    ]);

    res.json({
        status: true,
        pqrsi,
        total
    })
}

/**
 * Operación para crear un nuevo pqrsi dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearPQRS = async(req, res = response) => {
    try {
        const uid = req.uid;

        const pqrsNew = new PQRSIncidente({
            usuarioRegistro: uid,
            ...req.body
        });
        pqrsNew.fechaOcurrencia = addHoursDate(req.body.fechaOcurrencia)

        const pqrsRet = await pqrsNew.save();

        res.json({
            status: true,
            pqrsRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación de PQRS - Ver logs'
        });
    }
}

module.exports = {
    getPQRS,
    crearPQRS
}