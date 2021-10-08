const { response } = require('express');
const Modelo = require('../models/modelo.model');
const { formatearNumCelular, formatearGenero } = require('../helpers/formateadores');

const getModelos = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [modelos, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Modelo.find({})
        .skip(desde) //se salta lo registros antes del desde (posicion en collecion)
        .populate('nacionalidad', 'countryName')
        .populate('ciudadResidencia', 'ciudadName')
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
        .limit(Number(process.env.LIMIT_QUERY_MODELO)),

        //Promesa 2
        Modelo.countDocuments()
    ]);

    res.json({
        status: true,
        modelos,
        total
    })
}

const crearModelo = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const modeloNew = new Modelo({
            usuario: uid,
            ...req.body
        });

        modeloNew.nombres = String(req.body.nombre).toUpperCase();
        modeloNew.apellidos = String(req.body.apellidos).toUpperCase();
        modeloNew.telCelular = formatearNumCelular(req.body.telCelular.replace(/\s/g, '')); //Elimina los espacios que pudieran llegar
        //modeloNew.telContEmer = formatearNumCelular(req.body.telContEmer.replace(/\s/g, ''));
        //modeloNew.genero = formatearGenero(req.body.genero);


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

const inactivarModelo = async(req, res = response) => {
    const idModelo = req.params.id;
    try {
        const resModeloDB = await Modelo.findById(idModelo);

        if (!resModeloDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe la modelo con ese id'
            });
        }

        const modeloInactivado = await Modelo.findByIdAndUpdate(idModelo, { estado: false, fechaInactivacion: new Date() }, { new: true });

        res.json({
            status: true,
            modelo: modeloInactivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion de Modelo - Ver logs'
        });
    }
}

const buscarModeloPorId = async(req, res = response) => {
    const idModelo = req.params.id;

    try {
        const modeloRet = await Modelo.findById(idModelo)
            .populate('nacionalidad', 'countryName')
            .populate('ciudadResidencia', 'ciudadName');

        if (!modeloRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe la modelo con ese id'
            });
        }

        res.json({
            status: true,
            modelo: modeloRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular de Modelo - Ver logs'
        });
    }
}

const actualizarModelo = async(req, res = response) => {
    const idModelo = req.params.id;
    try {
        const resModeloDB = await Modelo.findById(idModelo);
        req.body.nombres = String(req.body.nombres).toUpperCase();
        req.body.apellidos = String(req.body.apellidos).toUpperCase();

        if (!resModeloDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe la modelo con ese id'
            });
        }

        const { documento, ...campos } = req.body;

        const modeloActualizado = await Modelo.findByIdAndUpdate(idModelo, campos, { new: true });

        res.json({
            status: true,
            modelo: modeloActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion de Modelo - Ver logs'
        });
    }
}

const reactivarModelo = async(req, res = response) => {
    const idModelo = req.params.id;
    try {
        const resModeloDB = await Modelo.findById(idModelo);

        if (!resModeloDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe la modelo con ese id'
            });
        }

        const modeloReActivado = await Modelo.findByIdAndUpdate(idModelo, { estado: true, fechaInactivacion: '' }, { new: true });

        res.json({
            status: true,
            modelo: modeloReActivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la re activacion de Modelo - Ver logs'
        });
    }
}

const obtenerModeloPorEstado = async(req, res = repsonse) => {
    const estado = String(req.query.estado);

    const [modelos] = await Promise.all([
        Modelo.find({ estado: estado })
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
    ]);

    res.json({
        status: true,
        modelos
    })
}

module.exports = {
    getModelos,
    crearModelo,
    inactivarModelo,
    buscarModeloPorId,
    actualizarModelo,
    reactivarModelo,
    obtenerModeloPorEstado
}