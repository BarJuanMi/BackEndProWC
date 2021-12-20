const { response } = require('express');
const Administrativo = require('../models/administrativo.model');
const { formatearNumCelular, formatearGenero } = require('../helpers/formateadores');

const getAdministrativos = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [administrativos, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Administrativo.find({})
        .skip(desde) //se salta lo registros antes del desde (posicion en collecion)
        .populate('nacionalidad', 'countryName')
        .populate('ciudadResidencia', 'ciudadName')
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
        .limit(Number(process.env.LIMIT_QUERY_ADMON)),

        //Promesa 2
        Administrativo.countDocuments()
    ]);

    res.json({
        status: true,
        administrativos,
        total
    })
}

const crearAdministrativo = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const administrativoNew = new Administrativo({
            usuario: uid,
            ...req.body
        });

        administrativoNew.nombres = String(req.body.nombres).toUpperCase();
        administrativoNew.apellidos = String(req.body.apellidos).toUpperCase();
        administrativoNew.telCelular = formatearNumCelular(req.body.telCelular.replace(/\s/g, '')); //Elimina los espacios que pudieran llegar

        const administrativoRet = await administrativoNew.save();

        res.json({
            status: true,
            administrativoRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del empleado administrativo - Ver logs'
        });
    }
}

const inactivarAdministrativo = async(req, res = response) => {
    const idAdministrativo = req.params.id;
    try {
        const resAdministrativoDB = await Administrativo.findById(idAdministrativo);

        if (!resAdministrativoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el empleado administrativo con ese id'
            });
        }

        const administrativoInactivado = await Administrativo.findByIdAndUpdate(idAdministrativo, { estado: false, fechaInactivacion: new Date() }, { new: true });

        res.json({
            status: true,
            administrativo: administrativoInactivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion del empleado administrativo - Ver logs'
        });
    }
}

const buscarAdministrativoId = async(req, res = response) => {
    const idAdministrativo = req.params.id;

    try {
        const administrativoRet = await Administrativo.findById(idAdministrativo)
            .populate('nacionalidad', 'countryName')
            .populate('ciudadResidencia', 'ciudadName');

        if (!administrativoRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el empleado administrativo con ese id'
            });
        }

        res.json({
            status: true,
            administrativo: administrativoRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular del empleado administrativo - Ver logs'
        });
    }
}

const actualizarAdministrativo = async(req, res = response) => {
    const idAdministrativo = req.params.id;
    try {
        const resAdministrativoDB = await Administrativo.findById(idAdministrativo);
        req.body.nombres = String(req.body.nombres).toUpperCase();
        req.body.apellidos = String(req.body.apellidos).toUpperCase();

        if (!resAdministrativoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el empleado administrativo con ese id'
            });
        }

        const { documento, usuarioCreacion, tipoEmpleado, ...campos } = req.body;

        const administrativoActualizado = await Administrativo.findByIdAndUpdate(idAdministrativo, campos, { new: true });

        res.json({
            status: true,
            administrativo: administrativoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion del empleado administrativo - Ver logs'
        });
    }
}

const reactivarAdministrativo = async(req, res = response) => {
    const idAdministrativo = req.params.id;
    try {
        const resAdministrativoDB = await Administrativo.findById(idAdministrativo);

        if (!resAdministrativoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el empleado administrativo con ese id'
            });
        }

        const administrativoReActivado = await Administrativo.findByIdAndUpdate(idAdministrativo, { estado: true, fechaInactivacion: '' }, { new: true });

        res.json({
            status: true,
            administrativo: administrativoReActivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la re activacion del empleado administrativo - Ver logs'
        });
    }
}

const obtenerAdministrativoPorEstado = async(req, res = repsonse) => {
    const estado = String(req.query.estado);

    const [administrativos] = await Promise.all([
        Administrativo.find({ estado: estado })
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
    ]);

    res.json({
        status: true,
        administrativos
    })
}

module.exports = {
    getAdministrativos,
    crearAdministrativo,
    inactivarAdministrativo,
    buscarAdministrativoId,
    actualizarAdministrativo,
    reactivarAdministrativo,
    obtenerAdministrativoPorEstado
}