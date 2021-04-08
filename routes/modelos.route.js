/*
    Ruta: /api/modelos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getModelos, crearModelo } = require('../controllers/modelos.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getModelos);

router.post('/crearModelo', [
        validarJWT,
        check('nombres', 'El nombre de la modelo es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearModelo
);

module.exports = router;