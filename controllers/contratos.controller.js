const { response } = require('express');
const Contrato = require('../models/contrato.model');
const TipoContrato = require('../models/tipocontrato.model');
const Empleado = require('../models/empleado.model');
const Usuario = require('../models/usuario.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los contratos usando el desde como 
 * condicion inicial de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getContratos = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 10 en adelante, recordar que le numeracion comienza en 0
    const [contratos, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Contrato.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('empleado', 'documento nombApellConca')
        .populate('usuarioRegistro', 'nombre')
        .populate('usuarioCargoPDF', 'nombre')
        .populate('usuarioCargueDocsZIP', 'nombre')
        .populate('tipoContrato', 'tipocontratoDesc')
        .sort({ fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_CONTRATOS)),

        //Promesa 2
        Contrato.countDocuments()
    ]);

    res.json({
        status: true,
        contratos,
        total
    })
}

/**
 * Operación para crear un nuevo contrato dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegContrato = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        req.body.usuario = uid;

        const contratoNew = new Contrato({
            usuarioRegistro: uid,
            ...req.body
        });

        const idEmpleadoDB = await Empleado.findById(req.body.empleado);

        const tipoContrato = await TipoContrato.findById(req.body.tipo);

        contratoNew.estado = 'EN EJECUCIÓN';

        contratoNew.fechaInicioContrato = addHoursDate(req.body.fechaInicioContrato);
        if (req.body.fechaFinContrato !== null) {
            contratoNew.fechaFinContrato = addHoursDate(req.body.fechaFinContrato);
        }
        contratoNew.emplNomApel = String(idEmpleadoDB.nombres).toUpperCase() + ' ' + String(idEmpleadoDB.apellidos).toUpperCase();
        contratoNew.tipoContrato = tipoContrato._id;

        const contratoRet = await contratoNew.save();

        res.json({
            status: true,
            contratoRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la creación del registro de contrato - Ver logs'
        });
    }
}

/**
 * Operación para obtener un contrato mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarRegContratoId = async(req, res = response) => {

    const idContrato = req.params.id;
    try {
        const contratoRet = await Contrato
            .findById(idContrato)
            .populate('empleado', 'documento nombApellConca')
            .populate('usuarioRegistro', 'nombre')
            .populate('usuarioCargoPDF', 'nombre')
            .populate('usuarioCargueDocsZIP', 'nombre')
            .populate('tipoContrato', 'tipocontratoDesc')

        if (!contratoRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de contrato con ese id'
            });
        }

        res.json({
            status: true,
            contrato: contratoRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la busqueda particular del registro de contrato - Ver logs'
        });
    }
}

/**
 * Operación para actualizar el contrato dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const actualizarRegContrato = async(req, res = response) => {

    const uid = req.uid;
    const idContrato = req.params.id;
    try {
        const resContratoDB = await Contrato.findById(idContrato);

        if (!resContratoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de contrato con ese id'
            });
        }

        const {...campos } = req.body;

        campos.fechaFinContrato = new Date();

        console.log(JSON.stringify(campos));

        const contratoActualizado = await Contrato.findByIdAndUpdate(idContrato, campos, { new: true });

        res.json({
            status: true,
            contrato: contratoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualizacion del registro de contrato - Ver logs'
        });
    }
}

/**
 * Operación para eliminar fisicamente un contrato del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const eliminarRegContrato = async(req, res = response) => {

    const idContrato = req.params.id;
    try {
        const resContratoDB = await Contrato.findById(idContrato);

        if (!resContratoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de contrato con ese id'
            });
        }

        const contratoEliminado = await Contrato.findByIdAndDelete(idContrato);

        res.json({
            status: true,
            msg: 'Registro de contrato eliminado correctamente',
            contrato: contratoEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del registro de contrato - Ver logs'
        });
    }
}

/**
 * Operación para obtener un  tipo de contrato mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarTipoContratoId = async(req, res = response) => {

    const idTipoContrato = req.params.id;
    try {
        const tipoContratoRet = await TipoContrato.findById(idTipoContrato)

        if (!tipoContratoRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de contrato con ese id'
            });
        }

        res.json({
            status: true,
            tipoContratoRet: tipoContratoRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la busqueda particular del registro de tipo de contrato - Ver logs'
        });
    }
}

const borrarPDF = (adjuntoPath) => {
    if (fs.existsSync(adjuntoPath)) {
        fs.unlinkSync(adjuntoPath);
    }
}

module.exports = {
    getContratos,
    crearRegContrato,
    buscarRegContratoId,
    actualizarRegContrato,
    eliminarRegContrato,
    buscarTipoContratoId
}