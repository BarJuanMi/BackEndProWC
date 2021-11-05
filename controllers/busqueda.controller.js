const { response } = require('express');
const Hospital = require('../models/hospital.model');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Modelo = require('../models/modelo.model');
const Monitor = require('../models/monitor.model');
const Administrativo = require('../models/administrativo.model');

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

        case 'modelos':
            data = await Modelo.find({ nombres: regex });
            break;

        case 'monitores':
            data = await Monitor.find({ nombres: regex });
            break;

        case 'administrativos':
            data = await Administrativo.find({ nombres: regex });
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
    busquedaPorColeccion
}