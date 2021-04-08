const { response } = require('express');
const Modelo = require('../models/modelo.model');

const getModelos = async(req, res = response) => {

    const modelos = await Modelo.find()
        .populate('usuario', 'nombre email img');

    res.json({
        status: true,
        modelos
    })
}

const crearModelo = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)

        const modeloNew = new Modelo({
            usuario: uid,
            ...req.body
        });

        const modeloRet = await modeloNew.save();

        res.json({
            status: true,
            modeloRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación de Modelo - Ver logs'
        });
    }
}

module.exports = {
    getModelos,
    crearModelo
}