/*
    Ruta: /api/medicos
*/
const { Router } = require('express');
const { getMedicos, crearMedico, actualizarMedico, eliminarMedico } = require('../controllers/medicos.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//1er argumento - path
//2do argumento los middleware
//3er argumento la operacion del controlador
router.get('/', validarJWT, getMedicos);

router.post('/crearMedico', [
        validarJWT,
        check('nombre', 'El nombre del medico es obligatorio').not().isEmpty(),
        //Esto comprueba que el ID entrante, tenga la longitud y estructura de un ID
        //valido en la base de datos de Mongo, mas no que exista en la colleccion
        check('hospital', 'El id de hospital debe ser válido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put('/actualizarMedico/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarMedico
);

router.delete('/eliminarMedico/:id', validarJWT, eliminarMedico);

module.exports = router;