const { response } = require('express');
const fs = require('fs');
const Retiro = require('../models/retiro.model');

const borrarPDF = (antiguoPath) => {
    //console.log('El que va a borrar es: ' + antiguoPath)
    if (fs.existsSync(antiguoPath)) {
        fs.unlinkSync(antiguoPath);
    }
}

const actualizarPDFFiles = async(tipo, id, nombreArch, uidUsuario) => {
    let antiguoPath = '';

    switch (tipo) {
        case 'pazysalvos':
            const retiro = await Retiro.findById(id);
            if (!retiro) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${retiro.pathPDF}`;
            borrarPDF(antiguoPath);

            retiro.pathPDF = nombreArch;
            retiro.usuarioCargoPDF = uidUsuario;
            retiro.fechaCargoPDF = new Date();
            retiro.estadoCargoPDF = true;
            retiro.estado = 'FIRMADO';
            await retiro.save();
            return true;
            break;
    }
}

module.exports = {
    actualizarPDFFiles
}