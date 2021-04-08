const path = require('path');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const fs = require('fs');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const fileImageUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            status: false,
            msg: 'No existe una carpeta con el determinado tipo'
        });
    }

    //Valida que hay un archivo en la peticion
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            status: false,
            msg: 'No hay una imagen para cargar.'
        });
    }

    //Obtiene el archivo de la peticion
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');

    //Obtiene la extensio del archivo
    const extensionArch = nombreCortado[nombreCortado.length - 1];

    //Validar que la extension del archivo sea valida
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArch)) {
        return res.status(400).json({
            status: false,
            msg: 'La extensión del archivo de imagen no es valido.'
        });
    }
    //Generar el nombre del archivo
    const nombreArch = `${ uuidv4() }.${extensionArch}`;

    //Path para guardar la imagen
    const uploadPath = `./uploads/${tipo}/${nombreArch}`;

    //Mover la imagen al path destino
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({
                status: false,
                msg: 'Error al mover la imagen'
            });
        }

        //Actualizar la BD
        actualizarImagen(tipo, id, nombreArch);

        res.json({
            status: true,
            msg: 'Carga satisfactoria de la imagen'
        });
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const fileImageReturn = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/No_Image_Available.jpg`);
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileImageReturn,
    fileImageUpload
}