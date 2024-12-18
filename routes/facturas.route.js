/*
    Ruta: /api/prestamos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getFacturas, crearRegFactura, buscarRegFacturaId, eliminarRegFactura, actualizarRegFactura } = require('../controllers/facturas.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getFacturas);

router.post('/crearRegFactura', validarJWT, crearRegFactura);

router.get('/buscarRegFacturaId/:id', validarJWT, buscarRegFacturaId);

router.delete('/eliminarRegFactura/:id', validarJWT, eliminarRegFactura);

router.put('/actualizarRegFactura/:id', validarJWT, actualizarRegFactura);

module.exports = router;