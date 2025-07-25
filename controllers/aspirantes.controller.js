const { response } = require('express');
const Aspirante = require('../models/aspirante.model');
const Usuario = require('../models/usuario.model');
const Cargoaspirante = require('../models/cargoaspirante.model');
const Localidad = require('../models/localidadesciudad.model');
const TipoDocumento = require('../models/tipodocumento.model');
const { addHoursDate } = require('../helpers/formateadores');
const { formatearNumCelular } = require('../helpers/formateadores');

/**
 * Función para obtener todos los aspirantes usando el desde como 
 * condicion inical de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getRegAspirantes = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 15 en adelante, recordar que le numeracion comienza en 0

    const [aspirantes, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Aspirante.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('usuarioCreacion', 'nombre')
        .populate('tipoDocumento', 'tipoDocumentoShort tipoDocumentoDesc')
        .populate('cargoAspirante', 'cargoId cargoDesc')
        .sort({ fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_ASPIRANTES)),

        //Promesa 2
        Aspirante.countDocuments()
    ]);

    res.json({
        status: true,
        aspirantes,
        total
    })
}

/**
 * Función para crear un nuevo retiro dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegAspirante = async(req, res = response) => {
    try {
        console.log(req.body);

        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const aspiranteNew = new Aspirante({
            usuarioCreacion: uid,
            ...req.body
        });

        const tipoDocumentoId = await TipoDocumento.findById(req.body.tipoDocumento);
        const cargoAspiranteId = await Cargoaspirante.findById(req.body.cargoAspirante);
        const localidadId = await Localidad.findById(req.body.localidad);

        aspiranteNew.nombres = String(req.body.nombres).toUpperCase();
        aspiranteNew.apellidos = String(req.body.apellidos).toUpperCase();
        aspiranteNew.numCelular = String(req.body.telCelular).trim();
        aspiranteNew.estado = 'Registrado en App';
        aspiranteNew.nombApellAspConcat = String(req.body.nombres).toUpperCase() + ' ' + String(req.body.apellidos).toUpperCase();
        aspiranteNew.tipoDocumento = tipoDocumentoId._id;
        aspiranteNew.cargoAspirante = cargoAspiranteId._id;
        aspiranteNew.localidad = localidadId._id;

        const aspiranteRet = await aspiranteNew.save();

        res.json({
            status: true,
            aspiranteRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del registro de aspirante - Ver logs'
        });
    }
}

/**
 * Función para obtener un aspirante mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarAspirantePorId = async(req, res = response) => {
    const idAspirante = req.params.id;

    try {
        const aspiranteRet = await Aspirante
            .findById(idAspirante)
            .populate('usuarioCreacion', 'nombre')
            .populate('localidad', 'localidadName')
            .populate('cargoAspirante', 'cargoId cargoDesc');

        if (!aspiranteRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de aspirante con ese id'
            });
        }

        res.json({
            status: true,
            aspirante: aspiranteRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular del registro de aspirante - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const eliminarAspirante = async(req, res = response) => {
    const id = req.params.id;

    try {
        const resAspiranteDB = await Aspirante.findById(id);

        if (!resAspiranteDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el aspirante con ese id'
            });
        }

        const aspiranteEliminado = await Aspirante.findByIdAndDelete(id);

        res.json({
            status: true,
            msg: 'Aspirante eliminado correctamente',
            aspirante: aspiranteEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Aspirante - Ver logs'
        });
    }
}

module.exports = {
    crearRegAspirante,
    getRegAspirantes,
    buscarAspirantePorId,
    eliminarAspirante
}