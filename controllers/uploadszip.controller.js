const path = require('path');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { actualizarZIPFiles } = require('../helpers/actualizar-zip-file');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const fileCompressedUpload = (req, res = response) => {

    const uidUsuario = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['contratos', 'facturacion', 'servpublicos'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            status: false,
            msg: 'No existe una carpeta con el nombre' + tipo + 'para recibir archivos'
        });
    }

    //Valida que hay un archivo en la peticion
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            status: false,
            msg: 'No hay un archivo para cargar.'
        });
    }

    //Obtiene el archivo de la peticion
    const file = req.files.archivo;

    const nombreCortado = file.name.split('.');

    //Obtiene la extensio del archivo
    const extensionArch = nombreCortado[nombreCortado.length - 1];

    //Validar que la extension del archivo sea valida
    const extensionesValidas = ['zip', 'rar', '7z'];
    if (!extensionesValidas.includes(extensionArch)) {
        return res.status(400).json({
            status: false,
            msg: 'La extensión del archivo no es valido.'
        });
    }
    //Generar el nombre del archivo
    const nombreArch = `${ uuidv4() }.${extensionArch}`;

    //Path para guardar la imagen
    const uploadPath = `./uploads/${tipo}/${nombreArch}`;
    //console.log(uploadPath);

    //Mover la imagen al path destino
    file.mv(uploadPath, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: false,
                msg: 'Error al mover el archivo'
            });
        }

        //Actualizar la BD
        actualizarZIPFiles(tipo, id, nombreArch, uidUsuario);

        res.json({
            status: true,
            msg: 'Carga satisfactoria del archivo comprimido (zip, rar, 7z)',
            nombreArchivo: nombreArch
        });
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const fileCompressedReturn = (req, res = response) => {

    const tipo = req.params.tipo;
    const fileCompreName = req.params.zip;

    const pathFileCompre = path.join(__dirname, `../uploads/${tipo}/${fileCompreName}.zip`);

    console.log(pathFileCompre);

    if (fs.existsSync(pathFileCompre)) {
        res.setHeader('Content-Type', 'application/zip');
        res.contentType("application/zip");
        fs.createReadStream(pathFileCompre).pipe(res);
    } else {
        const pathFileCompre = path.join(__dirname, `../uploads/No_Image_Available.jpg`);
        res.sendFile(pathFileCompre);
    }
}

module.exports = {
    fileCompressedUpload,
    fileCompressedReturn
}