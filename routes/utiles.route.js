/*
    Ruta: /api/utiles
*/
const { Router } = require('express');
const { getCiudades, getPaises } = require('../controllers/utiles.controller');

const router = Router();

router.get('/ciudades', getCiudades);

router.get('/paises', getPaises);

module.exports = router;