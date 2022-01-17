const { response } = require('express');
const fs = require('fs');
const Retiro = require('../models/retiro.model');
const Aspirante = require('../models/aspirante.model');

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
            await retiro.save();
            return true;
            break;

        case 'hojasvida':
            const aspirante = await Aspirante.findById(id);
            if (!aspirante) {
                return false;
            }

            antiguoPathHV = `./uploads/${tipo}/${aspirante.pathHojaVidaPDF}`;
            borrarPDF(antiguoPath);

            aspirante.pathHojaVidaPDF = nombreArch;
            aspirante.estadoHVCargoPDF = true;
            await aspirante.save();
            return true;
            break;

        case 'respsicologico':
            const aspiranteres = await Aspirante.findById(id);
            if (!aspiranteres) {
                return false;
            }

            antiguoPathRes = `./uploads/${tipo}/${aspiranteres.pathResultadoPDF}`;
            borrarPDF(antiguoPathRes);

            aspiranteres.pathResultadoPDF = nombreArch;
            aspiranteres.estadoResCargoPDF = true;
            await aspiranteres.save();
            return true;
            break;
    }
}

module.exports = {
    actualizarPDFFiles
}