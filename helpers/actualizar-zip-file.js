const { response } = require('express');
const fs = require('fs');
const Contrato = require('../models/contrato.model');
const Factura = require('../models/factura.model');

const borrarZIP = (antiguoPathZIP) => {
    console.log('El zip que va a borrar es: ' + antiguoPathZIP)
    if (fs.existsSync(antiguoPathZIP)) {
        fs.unlinkSync(antiguoPathZIP);
    }
}

const actualizarZIPFiles = async(tipo, id, nombreArch, uidUsuario) => {
    let antiguoPathContra = '';

    switch (tipo) {
        case 'contratos':
            const contrato = await Contrato.findById(id);
            if (!contrato) {
                return false;
            }
            antiguoPathContra = `./uploads/${tipo}/${contrato.pathDocsZIP}`;
            borrarZIP(antiguoPathContra);

            contrato.pathDocsZIP = nombreArch;
            contrato.usuarioCargueDocsZIP = uidUsuario;
            contrato.fechaCargueDocsZIP = new Date();
            contrato.estadoCargueDocsZIP = true;
            await contrato.save();
            return true;
            break;

        case 'facturas':
            const factura = await Factura.findById(id);
            if (!factura) {
                return false;
            }
            antiguoPathContra = `./uploads/zip/${tipo}/${factura.pathDocsZIP}`;
            borrarZIP(antiguoPathContra);

            factura.pathDocsZIP = nombreArch;
            factura.usuarioCargueDocsZIP = uidUsuario;
            factura.fechaCargueDocsZIP = new Date();
            factura.estadoCargueDocsZIP = true;
            await factura.save();
            return true;
            break;
    }
}

module.exports = {
    actualizarZIPFiles
}