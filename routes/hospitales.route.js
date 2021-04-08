/*
    Ruta: /api/hospitales
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getHospitales, crearHospital, actualizarHospital, eliminarHospital } = require('../controllers/hospitales.controller')

const router = Router();

//1er argumento - path
//2do argumento los middleware
//3er argumento la operacion del controlador
router.get('/', validarJWT, getHospitales);

router.post('/crearHospital', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearHospital
);

router.put('/actualizarHospital/:id', [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarHospital
);

router.delete('/eliminarHospital/:id', validarJWT, eliminarHospital);

module.exports = router;