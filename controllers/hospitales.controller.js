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
            msg: 'Error durante la creación del Hospital - Ver logs'
        });
    }
}

const actualizarHospital = (req, res = response) => {
    res.json({
        status: true,
        msg: 'actualizarHospital Funcionando'
    })
}

const eliminarHospital = (req, res = response) => {
    res.json({
        status: true,
        msg: 'eliminarHospital Funcionando'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}