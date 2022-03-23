/*
    Ruta: /api/empleados
*/
const { Router } = require('express');
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
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getEmpleados);

router.get('/tipoEmpleados', validarJWT, getTipoEmpleados);

router.get('/tipo/:filtro', validarJWT, getEmpleadosxTipo);

router.post('/crearEmpleadoxTipo/:tipo', validarJWT, crearEmpleado);

router.get('/buscarEmpleadoId/:id', validarJWT, buscarEmpleadoPorId);

router.put('/actualizarEmpleado/:id', validarJWT, actualizarEmpleadoPorId);

router.put('/inactivarEmpleado/:id', validarJWT, inactivarEmpleado);

router.put('/reActivarEmpleado/:id', validarJWT, reactivarEmpleado);

router.get('/filtro/estado/:estado', validarJWT, obtenerEmpleadosPorEstado);

module.exports = router;