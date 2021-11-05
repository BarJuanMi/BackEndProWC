/*
    Ruta: /api/empleados
*/
const { Router } = require('express');
const { getEmpleados, crearEmpleado, getTipoEmpleados, getEmpleadosxTipo, buscarEmpleadoPorId } = require('../controllers/empleados.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getEmpleados);

router.get('/tipoEmpleados', validarJWT, getTipoEmpleados);

router.get('/tipo/:filtro', validarJWT, getEmpleadosxTipo);

router.post('/crearEmpleado', validarJWT, crearEmpleado);

router.get('/buscarEmpleadoId/:id', validarJWT, buscarEmpleadoPorId);

module.exports = router;