/*
    Ruta: /api/vacunas
*/
const { Router } = require('express');
const { getVacunados, crearRegVacunado } = require('../controllers/vacunados.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getVacunados);

router.post('/crearRegVacunado', validarJWT, crearRegVacunado);

module.exports = router;