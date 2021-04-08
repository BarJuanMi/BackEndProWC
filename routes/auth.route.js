/*
    Ruta: /api/login
*/
const { Router } = require('express');
const { login, loginGoogleSignIn } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router();

router.post('/', [
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no tiene una estructura correcta').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
)

router.post('/google', [
        check('token', 'El token de Google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    loginGoogleSignIn
)



module.exports = router;