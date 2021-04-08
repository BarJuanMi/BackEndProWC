const { response } = require('express');
const fs = require('fs');
const Hospital = require('../models/hospital.model');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');

const borrarImagen = (antiguoPath) => {
    console.log('antiguoPath ' + antiguoPath);
    if (fs.existsSync(antiguoPath)) {
        fs.unlinkSync(antiguoPath); //Borra la imagen de la carpeta del SO
    }
}

const actualizarImagen = async(tipo, id, nombreArch) => {

    let antiguoPath = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${medico.img}`;
            borrarImagen(antiguoPath);

            medico.img = nombreArch;
            await medico.save();
            return true;
            break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);

            if (!hospital) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${hospital.img}`;
            borrarImagen(antiguoPath);

            hospital.img = nombreArch;
            await hospital.save();
            return true;
            break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${usuario.img}`;
            borrarImagen(antiguoPath);

            usuario.img = nombreArch;
            await usuario.save();
            return true;
            break;
    }

}

module.exports = {
    actualizarImagen
}