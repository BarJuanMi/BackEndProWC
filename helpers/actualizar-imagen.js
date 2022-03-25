const { response } = require('express');
const fs = require('fs');
const Hospital = require('../models/hospital.model');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Empleado = require('../models/empleado.model');
const Vacunado = require('../models/vacunado.model');
const ServLavanderia = require('../models/servlavanderia.model');
const PQRSIncidente = require('../models/pqrsincidente.model');

const borrarImagen = (antiguoPath) => {
    //console.log('antiguoPath ' + antiguoPath);
    if (fs.existsSync(antiguoPath)) {
        fs.unlinkSync(antiguoPath); //Borra la imagen de la carpeta del SO
    }
}

const actualizarImagenMantenimientos = async(tipo, id, nombreArch) => {
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
            console.log(antiguoPath);
            console.log(nombreArch);

            borrarImagen(antiguoPath);

            usuario.img = nombreArch;
            await usuario.save();
            return true;
            break;
    }
}

const actualizarImagenPersonal = async(tipo, id, nombreArch) => {
    let antiguoPath = '';

    const empleado = await Empleado.findById(id);
    if (!empleado) {
        return false;
    }
    antiguoPath = `./uploads/${tipo}/${empleado.img}`;
    borrarImagen(antiguoPath);

    empleado.img = nombreArch;
    await empleado.save();
    return true;

}

const actualizarImagenProcesos = async(tipo, id, nombreArch) => {
    let antiguoPath = '';

    switch (tipo) {
        case 'vacunados':
            const vacunado = await Vacunado.findById(id);
            if (!vacunado) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${vacunado.img}`;
            borrarImagen(antiguoPath);

            vacunado.img = nombreArch;
            await vacunado.save();
            return true;
            break;

        case 'servlavanderia':
            const servlavanderia = await ServLavanderia.findById(id);
            if (!servlavanderia) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${servlavanderia.img}`;
            borrarImagen(antiguoPath);

            servlavanderia.img = nombreArch;
            await servlavanderia.save();
            return true;
            break;
        case 'pqrs':
            const pqrs = await PQRSIncidente.findById(id);
            if (!pqrs) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${pqrs.img}`;
            borrarImagen(antiguoPath);

            pqrs.img = nombreArch;
            await pqrs.save();
            return true;
            break;
    }
}

module.exports = {
    actualizarImagenMantenimientos,
    actualizarImagenPersonal,
    actualizarImagenProcesos
}