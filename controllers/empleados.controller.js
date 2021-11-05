const { response } = require('express');
const Empleado = require('../models/empleado.model');
const TipoEmpleado = require('../models/tipoempleado.model');
const { formatearNumCelular } = require('../helpers/formateadores');

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

const getEmpleadosxTipo = async(req, res = repsonse) => {
    const desde = Number(req.query.desde) || 0;
    const filtroTipo = req.params.filtro;

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

const crearEmpleado = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const empleadoNew = new Empleado({
            usuarioCreacion: uid,
            ...req.body
        });

        empleadoNew.nombres = String(req.body.nombres).toUpperCase();
        empleadoNew.apellidos = String(req.body.apellidos).toUpperCase();
        empleadoNew.telCelular = formatearNumCelular(req.body.telCelular.replace(/\s/g, '')); //Elimina los espacios que pudieran llegar

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

const buscarEmpleadoPorId = async(req, res = response) => {
    const idEmpleado = req.params.id;

    try {
        const empleadoRet = await Empleado.findById(idEmpleado)
            .populate('nacionalidad', 'countryName')
            .populate('ciudadResidencia', 'ciudadName')
            .populate('usuarioCreacion', 'nombre');

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

module.exports = {
    getEmpleados,
    crearEmpleado,
    getTipoEmpleados,
    getEmpleadosxTipo,
    buscarEmpleadoPorId
}