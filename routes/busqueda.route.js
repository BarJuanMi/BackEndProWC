/*
    Ruta: /api/busqueda
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { busquedaTotal, busquedaPorColeccion, busquedaColeccionEmpleados } = require('../controllers/busqueda.controller');

const router = Router();

//1er argumento - path
//2do argumento los middleware
//3er argumento la operacion del controlador
router.get('/todo/:arg', validarJWT, busquedaTotal);
router.get('/coleccion/:col/:arg', validarJWT, busquedaPorColeccion)
router.get('/coleccion/:col/:sub/:arg', validarJWT, busquedaColeccionEmpleados)

module.exports = router;