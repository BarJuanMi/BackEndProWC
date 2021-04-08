const { response } = require('express');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
        .populate('hospital', 'nombre img')
        .populate('usuario', 'nombre email img');

    res.json({
        status: true,
        medicos
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const idHosp = req.body.hospital;
    const uid = req.uid;

    try {
        const resHopital = await Hospital.findById(idHosp);
        const resMedico = await Medico.findById(id);

        if (!resHopital) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el id de hospital asociado al id de medico'
            });
        } else if (!resMedico) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el medico con ese id'
            });
        } else {
            const cambiosMedico = {
                ...req.body,
                usuario: uid,
                hospital: idHosp
            }

            const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

            res.json({
                status: true,
                medico: medicoActualizado
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualización del Usuario - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const eliminarMedico = async(req, res = response) => {
    const id = req.params.id;

    try {
        const resMedicoDB = await Medico.findById(id);

        if (!resMedicoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el medico con ese id'
            });
        }

        const medicoEliminado = await Medico.findByIdAndDelete(id);

        res.json({
            status: true,
            msg: 'Medico eliminado correctamente',
            medico: medicoEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Medico - Ver logs'
        });
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}