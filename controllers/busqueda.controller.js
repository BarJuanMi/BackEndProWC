const { response } = require('express');
const Hospital = require('../models/hospital.model');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Empleado = require('../models/empleado.model');
const TipoEmpleado = require('../models/tipoempleado.model');
const Aspirante = require('../models/aspirante.model');
const Ausentismo = require('../models/ausentismo.model');
const TipoAusentismo = require('../models/tipoausentismo.model');
const Retiro = require('../models/retiro.model');
const Memorando = require('../models/memorando.model');
const Contrato = require('../models/contrato.model');
const TipoContrato = require('../models/tipocontrato.model');

/**
 * Función para realizar la busqueda por determinado campo de una coleccion donde 
 * se presente el hallazgo en forma de caracter a caracter como si se tratara de una 
 * forma de expresion regular
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno según la peticion
 * @returns Array Objetos de Colecciones
 */
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

/**
 * Función para realizar la busqueda por determinado campo de una coleccion especifica, 
 * se realiza la busqueda en forma de caracter a caracter como si se tratara de una 
 * forma de expresion regular
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno según la peticion
 * @returns Array Objetos dependiendo de la coleccion que entro como criterio
 */
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
        case 'ausentismos':
            data = await Ausentismo.find({ emplNomApel: regex })
                .populate('empleado', 'documento nombApellConca')
                .populate('usuarioRegistro', 'nombre')
                .populate('usuarioAprobRecha', 'nombre')
                .populate('tipoAusentismo', 'tipoausentismoDesc')
                .sort({ fechaRegistro: -1 })
            break;
        case 'retiros':
            data = await Retiro.find({ emplNomApel: regex })
                .populate('empleado', 'documento nombApellConca')
                .populate('usuarioRegistro', 'nombre')
                .populate('usuarioCargoPDF', 'nombre')
                .sort({ fechaRegistro: -1 })
            break;
        case 'memorandos':
            data = await Memorando.find({ emplNomApel: regex })
                .populate('empleado', 'documento nombApellConca')
                .populate('usuarioRegistro', 'nombre')
                .populate('usuarioCargoPDF', 'nombre')
                .sort({ fechaRegistro: -1 })
            break;
        case 'contratos':
            data = await Contrato.find({ emplNomApel: regex })
                .populate('empleado', 'documento nombApellConca')
                .populate('usuarioRegistro', 'nombre')
                .populate('usuarioCargoPDF', 'nombre')
                .populate('tipoContrato', 'tipocontratoDesc')
                .sort({ fechaRegistro: -1 })
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

/**
 * Función para realizar la busqueda por determinado campo de la coleccion empleados, 
 * se realiza la busqueda en forma de caracter a caracter como si se tratara de una 
 * forma de expresion regular
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno según la peticion
 * @returns Array Objetos dependiendo de la coleccion empleados
 */
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