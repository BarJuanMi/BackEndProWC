/*
    Ruta: /api/prestamos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getFacturas, crearRegFactura, buscarRegFacturaId, eliminarRegFactura } = require('../controllers/facturas.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getFacturas);

router.post('/crearFactura', validarJWT, crearRegFactura);

router.get('/buscarFacturaPorId/:id', validarJWT, buscarRegFacturaId);

router.delete('/eliminarFactura/:id', validarJWT, eliminarRegFactura);

module.exports = router;