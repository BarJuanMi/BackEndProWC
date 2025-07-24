/*
    Ruta: /api/utiles
*/
const { Router } = require('express');
const {
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
    getTipoCuentaBanca,
    getListadoEPS,
    getListadoARL,
    getTipoDocumento,
} = require('../controllers/utiles.controller');

const router = Router();

router.get('/ciudades', getCiudades);

router.get('/paises', getPaises);

router.get('/cargosaspirante', getCargosAspirante);

router.get('/localidadesciudad', getLocalidadesCiudad);

router.get('/sedes', getSedes);

router.get('/tipopqrs', getTipoPQRS);

router.get('/tipoausentismo', getTipoAusentismo);

router.get('/tipocontrato', getTipoContrato);

router.get('/tipofactura', getTipoFactura);

router.get('/causalesretiro', getCausalesRetiro);

router.get('/entbancarias', getEntBancaria);

router.get('/tipocuentabanca', getTipoCuentaBanca);

router.get('/listadoeps', getListadoEPS);

router.get('/listadoarls', getListadoARL);

router.get('/tipodocumento', getTipoDocumento)

module.exports = router;