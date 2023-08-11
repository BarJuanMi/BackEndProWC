const { response } = require('express');
const Factura = require('../models/factura.model');
const TipoCompraFactura = require('../models/tipocomprafactura.model');
const { insertarRegAuditoria } = require('../helpers/auditoria-log');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getFacturas = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 10 en adelante, recordar que le numeracion comienza en 0

    const [facturas, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Factura.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('tipoCompraFactura', 'tipocomprafactDesc')
        .populate('usuarioRegistro', 'nombre')
        .populate('usuarioCargoPDF', 'nombre')
        .sort({ fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_FACTURAS)),

        //Promesa 2
        Factura.countDocuments()
    ]);

    res.json({
        status: true,
        facturas,
        total
    })
}

/**
 * Operación para crear un nuevo factura dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegFactura = async(req, res = response) => {

    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        req.body.usuario = uid;

        const facturaNew = new Factura({
            usuarioRegistro: uid,
            ...req.body
        });

        const tipoCompraFactura = await TipoCompraFactura.findById(req.body.tipo);

        facturaNew.fechaFactura = addHoursDate(req.body.fechaFactura);
        facturaNew.tipoCompraFactura = tipoCompraFactura._id;

        const facturaRet = await facturaNew.save();

        insertarRegAuditoria(uid, 'CREACIÓN DE NUEVA FACTURA', 'ALTA', JSON.stringify(req.body));

        res.json({
            status: true,
            facturaRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la creación del registro de factura - Ver logs'
        });
    }
}

/**
 * Operación para obtener un factura mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarRegFacturaId = async(req, res = response) => {

    const idFactura = req.params.id;
    try {
        const facturaRet = await Factura
            .findById(idFactura)
            .populate('usuarioRegistro', 'nombre')
            .populate('usuarioCargoPDF', 'nombre')
            .populate('tipoCompraFactura', 'tipocomprafactDesc')

        if (!facturaRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de factura con ese id'
            });
        }

        res.json({
            status: true,
            factura: facturaRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la busqueda particular del registro de factura - Ver logs'
        });
    }
}

/**
 * Operación para eliminar fisicamente un factura del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const eliminarRegFactura = async(req, res = response) => {

    const idFactura = req.params.id;
    try {
        const resFacturaDB = await Factura.findById(idFactura);

        if (!resFacturaDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de factura con ese id'
            });
        }

        const facturaEliminado = await Factura.findByIdAndDelete(idFactura);

        insertarRegAuditoria(uid, 'ELIMINACIÓN DE FACTURA', 'BAJA', JSON.stringify(req.body));

        res.json({
            status: true,
            msg: 'Registro de factura eliminado correctamente',
            factura: facturaEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del registro de factura - Ver logs'
        });
    }
}

module.exports = {
    getFacturas,
    crearRegFactura,
    buscarRegFacturaId,
    eliminarRegFactura,
}