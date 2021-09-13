/*
    Ruta: /api/monitores
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getMonitores, crearMonitor, inactivarMonitor, buscarMonitorPorId, actualizarMonitor, reActivarMonitor } = require('../controllers/monitores.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getMonitores);

router.post('/crearMonitor', [
        validarJWT,
        check('tipoDocumento', 'El tipo de documento es obligatorio').not().isEmpty(),
        check('nombres', 'Los nombres son obligatorio').not().isEmpty(),
        check('genero', 'El genero es obligatorio').not().isEmpty(),
        check('numHijos', 'El numero de hijos es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorio').not().isEmpty(),
        check('emailCorporativo', 'El email es obligatorio').not().isEmpty(),
        check('emailCorporativo', 'La estructura del email esta incorrecta').isEmail(),
        check('telCelular', 'El teléfono célular es obligatorio').not().isEmpty(),
        check('direccion', 'Los apellidos son obligatorio').not().isEmpty(),
        check('rh', 'El rh sanguineo es obligatorio').not().isEmpty(),
        check('nomContEmer', 'El nombre del contacto de emergencia es obligatorio').not().isEmpty(),
        check('telContEmer', 'El teléfono del contacto de emergencia es obligatorio').not().isEmpty(),
        check('entidadBanco', 'La entidad bancaria es obligatoria').not().isEmpty(),
        check('numCuentaBanco', 'El número de cuenta bancaria es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearMonitor
);

router.put('/inactivarMonitor/:id', validarJWT, inactivarMonitor);

router.put('/reActivarMonitor/:id', validarJWT, reActivarMonitor);

router.get('/buscarMonitorId/:id', validarJWT, buscarMonitorPorId);

router.put('/actualizarMonitor/:id', [
        validarJWT,
        check('tipoDocumento', 'El tipo de documento es obligatorio').not().isEmpty(),
        check('nombres', 'Los nombres son obligatorio').not().isEmpty(),
        check('genero', 'El genero es obligatorio').not().isEmpty(),
        check('numHijos', 'El numero de hijos es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorio').not().isEmpty(),
        check('emailCorporativo', 'El email es obligatorio').not().isEmpty(),
        check('emailCorporativo', 'La estructura del email esta incorrecta').isEmail(),
        check('telCelular', 'El teléfono célular es obligatorio').not().isEmpty(),
        check('direccion', 'Los apellidos son obligatorio').not().isEmpty(),
        check('rh', 'El rh sanguineo es obligatorio').not().isEmpty(),
        check('nomContEmer', 'El nombre del contacto de emergencia es obligatorio').not().isEmpty(),
        check('telContEmer', 'El teléfono del contacto de emergencia es obligatorio').not().isEmpty(),
        check('entidadBanco', 'La entidad bancaria es obligatoria').not().isEmpty(),
        check('numCuentaBanco', 'El número de cuenta bancaria es obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarMonitor
);

module.exports = router;