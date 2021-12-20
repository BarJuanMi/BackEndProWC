/*
    Ruta: /api/aspirantes
*/
const { Router } = require('express');
const { getRegAspirantes, crearRegAspirante, buscarAspirantePorId } = require('../controllers/aspirantes.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getRegAspirantes);

router.post('/crearRegAspirante', validarJWT, crearRegAspirante);

router.get('/buscarAspirantePorId/:id', validarJWT, buscarAspirantePorId);

module.exports = router;