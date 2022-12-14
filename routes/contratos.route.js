/*
    Ruta: /api/contratos
*/
const { Router } = require('express');
const { getContratos, crearRegContrato, buscarRegContratoId, actualizarRegContrato, eliminarRegContrato } = require('../controllers/contratos.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getContratos);

router.post('/crearRegContrato', validarJWT, crearRegContrato);

router.get('/buscarRegContratoId/:id', validarJWT, buscarRegContratoId);

router.put('/actualizarRegContrato/:id', validarJWT, actualizarRegContrato);

router.delete('/eliminarRegContrato/:id', validarJWT, eliminarRegContrato);

module.exports = router;