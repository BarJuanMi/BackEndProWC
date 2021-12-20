const { response } = require('express');
const Ciudad = require('../models/ciudad.model');
const Pais = require('../models/pais.model');
const Tipopqrs = require('../models/tipopqrs.model');
const CargoAspirante = require('../models/cargoaspirante.model');
const Localidad = require('../models/localidadesciudad.model');

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

const getTipoPQRS = async(req, res = response) => {
    const [tipopqrs] = await Promise.all([
        Tipopqrs.find({}).sort({ tipopqrsId: 1 })
    ]);

    res.json({
        status: true,
        tipopqrs
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

module.exports = {
    getCiudades,
    getPaises,
    getTipoPQRS,
    getCargosAspirante,
    getLocalidadesCiudad
}