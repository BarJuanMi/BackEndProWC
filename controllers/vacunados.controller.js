const { response } = require('express');
const Vacunado = require('../models/vacunado.model');

const getVacunados = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [vacunados, total] = await Promise.all([
        Vacunado.find({})
        .skip(desde)
        .populate('modelo', 'documento nombres apellidos')
        .populate('usuario', 'nombre')
        .limit(Number(process.env.LIMIT_QUERY_VACUNADOS)),

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

        const resVacuModeloDB = await Vacunado.find({ modelo: req.body.modelo });

        if (resVacuModeloDB) {
            return res.status(400).json({
                status: false,
                msg: 'Ya existe un registro de vacunación para esta modelo.'
            });

        } else {
            const vacunadoRegRet = await vacunadoRegNew.save();

            res.json({
                status: true,
                vacunadoRegRet
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del registro de vacunado - Ver logs'
        });
    }
}

const eliminarRegVacunado = async(req, res = response) => {
    const idRegVacunado = req.params.id;
    try {
        const resRegVacDB = await Vacunado.findById(idRegVacunado);

        if (!resRegVacDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de vacunado con ese id'
            });
        }

        const regVacEliminado = await Vacunado.findByIdAndDelete(idRegVacunado);

        res.json({
            status: true,
            msg: 'Registro de vacunado eliminado correctamente',
            vacunado: regVacEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Registro de vacunado - Ver logs'
        });
    }
}

const crearRegDosis = async(req, res = response) => {

    console.log('LLego a esa mierda' + req.body);

    const idRegVacunado = req.params.id;
    try {
        const resRegVacDB = await Vacunado.findById(idRegVacunado);

        if (!resRegVacDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de vacunado con ese id'
            });
        }

        const fechaDosis = req.body.fechaDosis;
        const numeroDosis = req.body.numDosis;
        var regVacActualizado = '';

        switch (numeroDosis) {
            case '2daDosis':
                regVacActualizado = await Vacunado.findByIdAndUpdate(idRegVacunado, { fechaSecDosis: fechaDosis }, { new: true });
                break;

            case '3raDosis':
                regVacActualizado = await Vacunado.findByIdAndUpdate(idRegVacunado, { fechaTerDosis: fechaDosis }, { new: true });
                break;

            case '4taDosis':
                regVacActualizado = await Vacunado.findByIdAndUpdate(idRegVacunado, { fechaCuarDosis: fechaDosis }, { new: true });
                break;
        }

        res.json({
            status: true,
            vacunado: regVacActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la actualización del registro de vacunado - Ver logs'
        });
    }
}


module.exports = {
    getVacunados,
    crearRegVacunado,
    eliminarRegVacunado,
    crearRegDosis
}