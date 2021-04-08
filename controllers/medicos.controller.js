const { response } = require('express');
const Medico = require('../models/medico.model');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
        .populate('hospital', 'nombre img')
        .populate('usuario', 'nombre email img');

    res.json({
        status: true,
        medicos
    })
}

const crearMedico = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const hospitalRel = req.hospital;

        const medicoNew = new Medico({
            usuario: uid,
            hospital: hospitalRel,
            ...req.body
        });

        const medicoRet = await medicoNew.save();

        res.json({
            status: true,
            medicoRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del Medico - Ver logs'
        });
    }
}

const actualizarMedico = (req, res = response) => {
    res.json({
        status: true,
        msg: 'actualizarMedico Funcionando'
    })
}

const eliminarMedico = (req, res = response) => {
    res.json({
        status: true,
        msg: 'eliminarMedico Funcionando'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}