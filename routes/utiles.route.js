/*
    Ruta: /api/utiles
*/
const { Router } = require('express');
const { getCiudades, getPaises, getTipoPQRS } = require('../controllers/utiles.controller');

const router = Router();

router.get('/ciudades', getCiudades);

router.get('/paises', getPaises);

router.get('/tipopqrs', getTipoPQRS);

module.exports = router;