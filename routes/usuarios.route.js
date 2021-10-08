/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { getUsuarios, crearUsuarioPorRegister, crearUsuarioPorApp, actualizarUsuario, inactivarUsuario, buscarUsuarioPorId, reactivarUsuario } = require('../controllers/usuarios.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//1er argumento - path
//2do argumento los middleware
//3er argumento la operacion del controlador
router.get('/', validarJWT, getUsuarios);

router.post('/crearUsuarioPorRegister', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no tiene una estructura correcta').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUsuarioPorRegister
);

router.post('/crearUsuarioPorApp', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no tiene una estructura correcta').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
    ],
    crearUsuarioPorApp
);

router.put('/actualizarUsuario/:id', [
        validarJWT,
        check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no tiene una estructura correcta').isEmail(),
        validarCampos
    ],
    actualizarUsuario
);

router.get('/buscarUsuarioId/:id', validarJWT, buscarUsuarioPorId);

router.delete('/inactivarUsuario/:id', validarJWT, inactivarUsuario);

router.put('/reactivarUsuario/:id', validarJWT, reactivarUsuario)

module.exports = router;