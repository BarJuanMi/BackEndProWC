/*
    Ruta: /api/auditorias
*/
const { Router } = require('express');
const { getAuditorias, crearRegAuditoria } = require('../controllers/auditorias.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getAuditorias);

router.post('/crearRegAuditoria', validarJWT, crearRegAuditoria);

module.exports = router;