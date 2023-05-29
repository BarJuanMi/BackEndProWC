/*
  Ruta: /api/files/uploadspdf
 */
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileCompressedReturn, fileCompressedUpload } = require('../controllers/uploadszip.controller')

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileCompressedUpload);

router.get('/obtenerzip/:tipo/:zip', fileCompressedReturn);

module.exports = router;