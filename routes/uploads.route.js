/*
    Ruta: /api/files/uploads
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileImageUpload, fileImageReturn } = require('../controllers/uploads.controller')

const router = Router();

router.use(expressFileUpload());

//1er argumento - path
//2do argumento los middleware
//3er argumento la operacion del controlador
router.put('/:tipo/:id', validarJWT, fileImageUpload);

router.get('/obtener/:tipo/:foto', fileImageReturn);

module.exports = router;