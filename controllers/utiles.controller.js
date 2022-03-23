const { response } = require('express');
const Ciudad = require('../models/ciudad.model');
const Pais = require('../models/pais.model');
const Tipopqrs = require('../models/tipopqrs.model');
const CargoAspirante = require('../models/cargoaspirante.model');
const Localidad = require('../models/localidadesciudad.model');
const Sede = require('../models/sede.model');
const Usuario = require('../models/usuario.model');

const getCiudades = async(req, res = response) => {
    const [ciudades] = await Promise.all([
        Ciudad.find({}).sort({ ciudadId: 1 })
    ]);

    res.json({
        status: true,
        ciudades
    })
}

const getPaises = async(req, res = response) => {
    const [paises] = await Promise.all([
        Pais.find({}).sort({ countryId: 1 })
    ]);

    res.json({
        status: true,
        paises
    })
}

const getCargosAspirante = async(req, res = response) => {
    const [cargosAspirantes] = await Promise.all([
        CargoAspirante.find({}).sort({ cargoId: 1 })
    ]);

    res.json({
        status: true,
        cargosAspirantes
    })
}

const getLocalidadesCiudad = async(req, res = response) => {
    const [localidades] = await Promise.all([
        Localidad.find({}).sort({ localidadName: 1 })
    ])

    res.json({
        status: true,
        localidades
    })
}

const getSedes = async(req, res = response) => {
    const [sedes] = await Promise.all([
        Sede.find({}).sort({ nombre: 1 })
        .populate('ciudad', 'ciudadName')
        .populate('localidad', 'localidadName')
    ]);

    res.json({
        status: true,
        sedes
    })
}

const getTipoPQRS = async(req, res = response) => {
    const [tipospqrs] = await Promise.all([
        Tipopqrs.find({}).sort({ tipopqrsId: -1 })
        .populate('usuarioAsig', 'nombre')
    ]);

    res.json({
        status: true,
        tipospqrs
    })
}

module.exports = {
    getCiudades,
    getPaises,
    getCargosAspirante,
    getLocalidadesCiudad,
    getSedes,
    getTipoPQRS
}