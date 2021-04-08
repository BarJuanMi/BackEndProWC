const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre email img');

    res.json({
        status: true,
        hospitales
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const crearHospital = async(req, res = reponse) => {

    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const hospitalNew = new Hospital({ //crea un model hospital y para el campo usuario le setea el uidUsua
            usuario: uid,
            ...req.body
        });

        const hospitalRet = await hospitalNew.save();

        res.json({
            status: true,
            hospitalRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del hospital - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarHospital = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const resHopital = await Hospital.findById(id);

        if (!resHopital) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el hospital con ese id'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            status: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualización del hospital - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const eliminarHospital = async(req, res = response) => {

    const id = req.params.id;

    try {
        const resHospitalDB = await Hospital.findById(id);

        if (!resHospitalDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el hospital con ese id'
            });
        }

        const hospitalEliminado = await Hospital.findByIdAndDelete(id);

        res.json({
            status: true,
            msg: 'Hospital eliminado correctamente',
            hospital: hospitalEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Hospital - Ver logs'
        });
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}