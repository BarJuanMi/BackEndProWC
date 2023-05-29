/*
    Ruta: /api/utiles
*/
const { Router } = require('express');
const { getCiudades, getPaises, getCargosAspirante, getLocalidadesCiudad, getSedes, getTipoPQRS, getTipoAusentismo, getTipoContrato, getCausalesRetiro } = require('../controllers/utiles.controller');

const router = Router();

router.get('/ciudades', getCiudades);

router.get('/paises', getPaises);

router.get('/cargosaspirante', getCargosAspirante);

router.get('/localidadesciudad', getLocalidadesCiudad);

router.get('/sedes', getSedes);

router.get('/tipopqrs', getTipoPQRS);

router.get('/tipoausentismo', getTipoAusentismo);

router.get('/tipocontrato', getTipoContrato);

router.get('/causalesretiro', getCausalesRetiro);

module.exports = router;