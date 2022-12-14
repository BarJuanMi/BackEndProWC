/*
    Ruta: /api/memorandos
*/
const { Router } = require('express');
const { getMemorandos, crearRegMemorando, buscarRegMemorandoId, actualizarRegMemorando, eliminarRegMemorando } = require('../controllers/memorandos.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getMemorandos);

router.post('/crearRegMemorando', validarJWT, crearRegMemorando);

router.get('/buscarRegMemorandoId/:id', validarJWT, buscarRegMemorandoId);

router.put('/actualizarRegMemorando/:id', validarJWT, actualizarRegMemorando);

router.delete('/eliminarRegMemorando/:id', validarJWT, eliminarRegMemorando);

module.exports = router;