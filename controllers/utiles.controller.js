const { response } = require('express');
const Ciudad = require('../models/ciudad.model');
const Pais = require('../models/pais.model');

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

module.exports = {
    getCiudades,
    getPaises
}