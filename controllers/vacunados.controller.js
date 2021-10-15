const { response } = require('express');
const Vacunado = require('../models/vacunado.model');

const getVacunados = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [vacunados, total] = await Promise.all([
        Vacunado.find({})
        .skip(desde)
        .populate('modelo', 'documento nombres apellidos')
        .populate('usuario', 'nombre')
        .limit(Number(process.env.LIMIT_QUERY_MODELO)),

        //Promesa 2
        Vacunado.countDocuments()
    ]);

    res.json({
        status: true,
        vacunados,
        total
    })
}

const crearRegVacunado = async(req, res = response) => {
    try {
        const uid = req.uid;
        const vacunadoRegNew = new Vacunado({
            usuario: uid,
            ...req.body
        });

        const vacunadoRegRet = await vacunadoRegNew.save();

        res.json({
            status: true,
            vacunadoRegRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del registro de vacunado - Ver logs'
        });
    }
}

module.exports = {
    getVacunados,
    crearRegVacunado
}