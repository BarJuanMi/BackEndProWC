/*
    Ruta: /api/pqrs
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { crearPQRS, getPQRS } = require('../controllers/pqrsincidentes.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getPQRS);

router.post('/crearPQRS', validarJWT, crearPQRS);

module.exports = router;