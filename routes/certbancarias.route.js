/*
    Ruta: /api/certbancarias
*/
const { Router } = require('express');
const { getCertBancarias, crearRegCertBancaria, buscarRegCertBancariaId, eliminarRegCertBancaria, actualizarRegCertBancaria } = require('../controllers/certbancarias.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getCertBancarias);

router.post('/crearRegCertBancaria', validarJWT, crearRegCertBancaria);

router.get('/buscarRegCertBancariaId/:id', validarJWT, buscarRegCertBancariaId);

router.put('/actualizarRegCertBancaria/:id', validarJWT, actualizarRegCertBancaria);

router.delete('/eliminarRegCertBancaria/:id', validarJWT, eliminarRegCertBancaria);

module.exports = router;