/*
  Ruta: /api/files/uploadspdf
 */
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');
const { filePDFUpload, filePDFReturn } = require('../controllers/uploadspdf.controller')

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, filePDFUpload);

router.get('/obtenerpdf/:tipo/:pdf', filePDFReturn);

module.exports = router;