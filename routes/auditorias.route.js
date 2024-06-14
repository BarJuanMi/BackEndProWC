/*
    Ruta: /api/auditorias
*/
const { Router } = require('express');
const { getAuditorias, crearRegAuditoria } = require('../controllers/auditorias.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getAuditorias);

router.post('/crearRegAuditoria', crearRegAuditoria);

module.exports = router;