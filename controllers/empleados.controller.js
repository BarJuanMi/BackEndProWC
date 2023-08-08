const { response } = require('express');
const Empleado = require('../models/empleado.model');
const TipoEmpleado = require('../models/tipoempleado.model');
const Pais = require('../models/pais.model');
const Ciudad = require('../models/ciudad.model');
const Usuario = require('../models/usuario.model');
const { formatearNumCelular } = require('../helpers/formateadores');
const { validationResult } = require('express-validator');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getEmpleados = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const [empleados, total] = await Promise.all([

        Empleado.find({})
        .skip(desde)
        .populate('nacionalidad', 'countryName')
        .populate('ciudadResidencia', 'ciudadName')
        .populate('usuarioCreacion', 'nombre')
        .populate('tipoEmpleado', 'tipoEmpleadoDesc')
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
        .limit(Number(process.env.LIMIT_QUERY_EMPLEADO)),

        //Promesa 2
        Empleado.countDocuments()
    ]);

    res.json({
        status: true,
        empleados,
        total
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getTipoEmpleados = async(req, res = response) => {
    const [tipoempleados, total] = await Promise.all([

        TipoEmpleado.find({})
        .sort({ estado: -1, nombres: 1, apellidos: 1 }),

        //Promesa 2
        TipoEmpleado.countDocuments()
    ]);

    res.json({
        status: true,
        tipoempleados,
        total
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getEmpleadosxTipo = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const filtroTipo = String(req.params.filtro).toUpperCase();

    const tipoEmplId = await TipoEmpleado.find({ tipoEmpleadoDesc: filtroTipo });

    const [empleados, total] = await Promise.all([
        Empleado.find({ tipoEmpleado: tipoEmplId })
        .skip(desde)
        .populate('nacionalidad', 'countryName')
        .populate('ciudadResidencia', 'ciudadName')
        .populate('usuarioCreacion', 'nombre')
        .populate('tipoEmpleado', 'tipoEmpleadoDesc')
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
        .limit(Number(process.env.LIMIT_QUERY_EMPLEADO)),

        //Promesa 2
        Empleado.countDocuments({ tipoEmpleado: tipoEmplId })
    ]);

    res.json({
        status: true,
        empleados,
        total
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const crearEmpleado = async(req, res = response) => {
    try {
        const filtroTipo = String(req.params.tipo).toUpperCase();
        const tipoEmpleado = await TipoEmpleado.findOne({ tipoEmpleadoDesc: filtroTipo });

        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const empleadoNew = new Empleado({
            usuarioCreacion: uid,
            ...req.body
        });

        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                status: true,
                msg: 'Error por información faltante de campos',
                errors: errores.mapped()
            });
        }

        empleadoNew.nombres = String(req.body.nombres).toUpperCase();
        empleadoNew.apellidos = String(req.body.apellidos).toUpperCase();
        empleadoNew.telCelular = formatearNumCelular(req.body.telCelular.replace(/\s/g, '')); //Elimina los espacios que pudieran llegar
        empleadoNew.tipoEmpleado = tipoEmpleado._id;
        empleadoNew.nombApellConca = String(req.body.nombres).toUpperCase() + ' ' + String(req.body.apellidos).toUpperCase();

        const empleadoRet = await empleadoNew.save();

        res.json({
            status: true,
            empleadoRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación de Empleado - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const buscarEmpleadoPorId = async(req, res = response) => {
    const idEmpleado = req.params.id;

    try {
        const empleadoRet = await Empleado.findById(idEmpleado)
            .populate('nacionalidad', 'countryName')
            .populate('ciudadResidencia', 'ciudadName')
            .populate('usuarioCreacion', 'nombre')
            .populate('tipoEmpleado', 'tipoEmpleadoDesc');

        if (!empleadoRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el Empleado con ese id'
            });
        }

        res.json({
            status: true,
            empleado: empleadoRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular de Empleado - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const inactivarEmpleado = async(req, res = response) => {
    const idEmpleado = req.params.id;

    try {
        const resEmpleadoDB = await Empleado.findById(idEmpleado);

        if (!resEmpleadoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el empleado con ese id'
            });
        }

        const empleadoInactivado = await Empleado.findByIdAndUpdate(idEmpleado, { estado: false, fechaInactivacion: new Date() }, { new: true });

        res.json({
            status: true,
            empleado: empleadoInactivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion de Empleado - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const reactivarEmpleado = async(req, res = response) => {
    const idEmpleado = req.params.id;
    try {
        const resEmpleadoDB = await Empleado.findById(idEmpleado);

        if (!resEmpleadoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el empleado con ese id'
            });
        }

        const empleadoReActivado = await Empleado.findByIdAndUpdate(idEmpleado, { estado: true, fechaInactivacion: '' }, { new: true });

        res.json({
            status: true,
            modelo: empleadoReActivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la re activacion del empleado - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarEmpleadoPorId = async(req, res = response) => {
    const idEmpleado = req.params.id;
    try {
        const resEmpleadoDB = await Empleado.findById(idEmpleado);
        req.body.nombres = String(req.body.nombres).toUpperCase();
        req.body.apellidos = String(req.body.apellidos).toUpperCase();
        req.body.nombApellConca = String(req.body.nombres).toUpperCase() + ' ' + String(req.body.apellidos).toUpperCase();

        if (!resEmpleadoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el empleado con ese id'
            });
        }

        const { documento, usuarioCreacion, ...campos } = req.body;

        const empleadoActualizado = await Empleado.findByIdAndUpdate(idEmpleado, campos, { new: true });

        res.json({
            status: true,
            empleado: empleadoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion del empleado - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const obtenerEmpleadosPorEstado = async(req, res = response) => {
    const estado = Boolean(req.params.estado);

    const [empleados] = await Promise.all([
        Empleado.find({ estado: estado })
        .populate('nacionalidad', 'countryName')
        .populate('ciudadResidencia', 'ciudadName')
        .populate('usuarioCreacion', 'nombre')
        .populate('tipoEmpleado', 'tipoEmpleadoDesc')
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
    ]);

    res.json({
        status: true,
        empleados
    })
}

module.exports = {
    getEmpleados,
    crearEmpleado,
    getTipoEmpleados,
    getEmpleadosxTipo,
    buscarEmpleadoPorId,
    reactivarEmpleado,
    inactivarEmpleado,
    actualizarEmpleadoPorId,
    obtenerEmpleadosPorEstado
}