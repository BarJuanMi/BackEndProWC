/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require('../controllers/usuarios.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//1er argumento - path
//2do argumento los middleware
//3er argumento la operacion del controlador
router.get('/', validarJWT, getUsuarios);
router.post('/crearUsuario', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no tiene una estructura correcta').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUsuario
);
router.put('/actualizarUsuario/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarUsuario
);
router.delete('/eliminarUsuario/:id', validarJWT, eliminarUsuario);

module.exports = router;