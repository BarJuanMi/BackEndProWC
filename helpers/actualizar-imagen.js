const { response } = require('express');
const fs = require('fs');
const Hospital = require('../models/hospital.model');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Modelo = require('../models/modelo.model');
const Monitor = require('../models/monitor.model');
const Empleado = require('../models/empleado.model');
const Vacunado = require('../models/vacunado.model');
const Administrativo = require('../models/administrativo.model');

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

    switch (tipo) {
        case 'modelos':
            const modelo = await Modelo.findById(id);
            if (!modelo) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${modelo.img}`;
            borrarImagen(antiguoPath);

            modelo.img = nombreArch;
            await modelo.save();
            return true;
            break;

        case 'monitores':
            const monitor = await Monitor.findById(id);
            if (!monitor) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${monitor.img}`;
            borrarImagen(antiguoPath);

            monitor.img = nombreArch;
            await monitor.save();
            return true;
            break;

        case 'empleados':
            const empleado = await Empleado.findById(id);
            if (!empleado) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${empleado.img}`;
            borrarImagen(antiguoPath);

            empleado.img = nombreArch;
            await empleado.save();
            return true;
            break;

        case 'administrativos':
            const administrativo = await Administrativo.findById(id);
            if (!administrativo) {
                return false;
            }
            antiguoPath = `./uploads/${tipo}/${administrativo.img}`;
            borrarImagen(antiguoPath);

            administrativo.img = nombreArch;
            await administrativo.save();
            return true;
            break;
    }
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
    }
}

module.exports = {
    actualizarImagenMantenimientos,
    actualizarImagenPersonal,
    actualizarImagenProcesos
}