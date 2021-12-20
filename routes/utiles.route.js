/*
    Ruta: /api/utiles
*/
const { Router } = require('express');
const { getCiudades, getPaises, getTipoPQRS, getCargosAspirante, getLocalidadesCiudad } = require('../controllers/utiles.controller');

const router = Router();

router.get('/ciudades', getCiudades);

router.get('/paises', getPaises);

router.get('/tipopqrs', getTipoPQRS);

router.get('/cargosaspirante', getCargosAspirante);

router.get('/localidadesciudad', getLocalidadesCiudad);

module.exports = router;