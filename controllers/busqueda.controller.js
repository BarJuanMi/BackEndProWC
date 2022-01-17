const { response } = require('express');
const Hospital = require('../models/hospital.model');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Empleado = require('../models/empleado.model');
const TipoEmpleado = require('../models/tipoempleado.model');
const Aspirante = require('../models/aspirante.model');

const busquedaTotal = async(req, res = response) => {

    const argSearch = req.params.arg;
    const regex = new RegExp(argSearch, 'i');

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex })
    ]);

    res.json({
        status: true,
        usuarios,
        medicos,
        hospitales
    });
}

const busquedaPorColeccion = async(req, res = response) => {
    const collection = req.params.col;
    const argSearch = req.params.arg;
    const regex = new RegExp(argSearch, 'i');

    let data = [];

    switch (collection) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('hospital', 'nombre img')
                .populate('usuario', 'nombre email img');
            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex });
            break;

        case 'aspirantes':
            data = await Aspirante.find({ nombApellAspConcat: regex })
                .populate('usuarioCreacion', 'nombre')
                .populate('cargoAspirante', 'cargoId cargoDesc')
                .sort({ fechaRegistro: -1 });
            break;

        default:
            return res.status(400).json({
                status: false,
                msg: 'No hay resultados para la busqueda'
            });
    }

    res.json({
        status: true,
        resultados: data
    });
}

const busquedaColeccionEmpleados = async(req, res = response) => {
    const collection = req.params.col;
    const argSearch = req.params.arg;
    const subTipo = String(req.params.sub).toUpperCase();
    const regex = new RegExp(argSearch, 'i');

    let data = [];

    switch (collection) {
        case 'empleados':
            const tipoEmplId = await TipoEmpleado.find({ tipoEmpleadoDesc: subTipo });
            data = await Empleado.find({ nombApellConca: regex, tipoEmpleado: tipoEmplId });
            break;

        default:
            return res.status(400).json({
                status: false,
                msg: 'No hay resultados para la busqueda'
            });
    }

    res.json({
        status: true,
        resultados: data
    });
}

module.exports = {
    busquedaTotal,
    busquedaPorColeccion,
    busquedaColeccionEmpleados
}