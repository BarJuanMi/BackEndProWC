const { response } = require('express');
const Ciudad = require('../models/ciudad.model');
const Pais = require('../models/pais.model');
const Tipopqrs = require('../models/tipopqrs.model');
const CargoAspirante = require('../models/cargoaspirante.model');
const Localidad = require('../models/localidadesciudad.model');
const Sede = require('../models/sede.model');
const TipoAusentismo = require('../models/tipoausentismo.model');
const TipoContrato = require('../models/tipocontrato.model');
const TipoCompraFactura = require('../models/tipocomprafactura.model');
const Usuario = require('../models/usuario.model');
const CausalRetiro = require('../models/causalretiros.model');
const EntBancaria = require('../models/entbancaria.model');
const TipoCuentaBanca = require('../models/tipocuentabanca')

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
    ]);

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

const getTipoAusentismo = async(req, res = response) => {
    const [tipoausentismos] = await Promise.all([
        TipoAusentismo.find({}).sort({ tipoausentismoId: 1 })
    ]);

    res.json({
        status: true,
        tipoausentismos
    })
}

const getTipoContrato = async(req, res = response) => {
    const [tipocontratos] = await Promise.all([
        TipoContrato.find({}).sort({ tipocontratoId: 1 })
    ])

    res.json({
        status: true,
        tipocontratos
    })
}

const getTipoFactura = async(req, res = response) => {
    const [tipoFacturas] = await Promise.all([
        TipoCompraFactura.find({}).sort({ tipocomprafactId: 1 })
    ])

    res.json({
        status: true,
        tipoFacturas
    })
}

const getCausalesRetiro = async(req, res = response) => {
    const [causalesretiro] = await Promise.all([
        CausalRetiro.find({}).sort({ causalretiroId: 1 })
    ])

    res.json({
        status: true,
        causalesretiro
    })
}

const getEntBancaria = async(req, res = response) => {
    const [entbancarias] = await Promise.all([
        EntBancaria.find({}).sort({ entbancariaId: 1 })
    ])

    console.log(entbancarias);

    res.json({
        status: true,
        entbancarias
    })
}

const getTipoCuentaBanca = async(req, res = response) => {
    const [tipocuentabancas] = await Promise.all([
        TipoCuentaBanca.find({}).sort({ tipocuentabancaId: 1 })
    ])

    res.json({
        status: true,
        tipocuentabancas
    })
}

module.exports = {
    getCiudades,
    getPaises,
    getCargosAspirante,
    getLocalidadesCiudad,
    getSedes,
    getTipoPQRS,
    getTipoAusentismo,
    getTipoContrato,
    getCausalesRetiro,
    getTipoFactura,
    getEntBancaria,
    getTipoCuentaBanca
}