/*
    Ruta: /api/empleados
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');

const {
    getEmpleados,
    crearEmpleado,
    getTipoEmpleados,
    getEmpleadosxTipo,
    buscarEmpleadoPorId,
    inactivarEmpleado,
    reactivarEmpleado,
    actualizarEmpleadoPorId,
    obtenerEmpleadosPorEstado
} = require('../controllers/empleados.controller');

const router = Router();

router.get('/', validarJWT, getEmpleados);

router.get('/tipoEmpleados', validarJWT, getTipoEmpleados);

router.get('/tipo/:filtro', validarJWT, getEmpleadosxTipo);

router.post(
    '/crearEmpleadoxTipo/:tipo', [
        validarJWT,
        /*check('documento', 'Campo documento vacío').not().isEmpty(),
        check('tipoDocumento', 'Campo tipoDocumento vacío').not().isEmpty(),
        check('genero', 'Campo genero vacío').not().isEmpty(),
        check('nombres', 'Campo nombres vacío').not().isEmpty(),
        check('apellidos', 'Campo apellidos vacío').not().isEmpty(),
        check('fechaNac', 'Campo fechaNac vacío').not().isEmpty(),
        check('direccion', 'Campo direccion vacío').not().isEmpty(),
        check('emailCorporativo', 'Campo emailCorporativo vacío').not().isEmpty(),
        check('telCelular', 'Campo telCelular vacío').not().isEmpty(),
        check('rh', 'Campo rh vacío').not().isEmpty(),
        check('nomContEmer', 'Campo nomContEmer vacío').not().isEmpty(),
        check('telContEmer', 'Campo telContEmer vacío').not().isEmpty(),
        check('fechaIngreso', 'Campo fechaIngreso vacío').not().isEmpty(),*/
    ],
    crearEmpleado
);

router.get('/buscarEmpleadoId/:id', validarJWT, buscarEmpleadoPorId);

router.put('/actualizarEmpleado/:id', validarJWT, actualizarEmpleadoPorId);

router.put('/inactivarEmpleado/:id', validarJWT, inactivarEmpleado);

router.put('/reActivarEmpleado/:id', validarJWT, reactivarEmpleado);

router.get('/filtro/estado/:estado', validarJWT, obtenerEmpleadosPorEstado);

module.exports = router;