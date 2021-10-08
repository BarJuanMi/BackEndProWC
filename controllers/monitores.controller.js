const { response } = require('express');
const Monitor = require('../models/monitor.model');
const { formatearNumCelular, formatearGenero } = require('../helpers/formateadores');

const getMonitores = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [monitores, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el monitor
        Monitor.find({})
        .skip(desde) //se salta lo registros antes del desde (posicion en collecion)
        .sort({ estado: -1, nombres: 1, apellidos: 1 })
        .limit(Number(process.env.LIMIT_QUERY_MONITOR)),

        //Promesa 2
        Monitor.countDocuments()
    ]);

    res.json({
        status: true,
        monitores,
        total
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const crearMonitor = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const monitorNew = new Monitor({
            usuario: uid,
            ...req.body
        });

        monitorNew.nombres = String(req.body.nombre).toUpperCase();
        monitorNew.apellidos = String(req.body.apellidos).toUpperCase();
        monitorNew.telCelular = formatearNumCelular(req.body.telCelular.replace(/\s/g, '')); //Elimina los espacios que pudieran llegar
        //monitorNew.telContEmer = formatearNumCelular(req.body.telContEmer.replace(/\s/g, ''));
        //monitorNew.genero = formatearGenero(req.body.genero);

        const monitorRet = await monitorNew.save();

        res.json({
            status: true,
            monitorRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación de Monitor - Ver logs'
        });
    }
}

const inactivarMonitor = async(req, res = response) => {
    const idMonitor = req.params.id;
    try {
        const resMonitorDB = await Monitor.findById(idMonitor);

        if (!resMonitorDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el monitor con ese id'
            });
        }

        const monitorInactivado = await Monitor.findByIdAndUpdate(idMonitor, { estado: false, fechaInactivacion: new Date() }, { new: true });

        res.json({
            status: true,
            monitor: monitorInactivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion de Monitor - Ver logs'
        });
    }
}

const buscarMonitorPorId = async(req, res = response) => {
    const idMonitor = req.params.id;

    try {
        const monitorRet = await Monitor.findById(idMonitor);

        if (!monitorRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el monitor con ese id'
            });
        }

        res.json({
            status: true,
            monitor: monitorRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular del monitor - Ver logs'
        });
    }
}

const actualizarMonitor = async(req, res = response) => {
    const idMonitor = req.params.id;
    try {
        const resMonitorDB = await Monitor.findById(idMonitor);
        req.body.nombres = String(req.body.nombres).toUpperCase();
        req.body.apellidos = String(req.body.apellidos).toUpperCase();

        if (!resMonitorDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el monitor con ese id'
            });
        }

        const { documento, ...campos } = req.body;

        const monitorActualizado = await Monitor.findByIdAndUpdate(idMonitor, campos, { new: true });

        res.json({
            status: true,
            monitor: monitorActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion de Monitor - Ver logs'
        });
    }
}

const reActivarMonitor = async(req, res = response) => {
    const idMonitor = req.params.id;
    try {
        const resMonitorDB = await Monitor.findById(idMonitor);

        if (!resMonitorDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el monitor con ese id'
            });
        }

        const monitorReActivado = await Monitor.findByIdAndUpdate(idMonitor, { estado: true, fechaInactivacion: '' }, { new: true });

        res.json({
            status: true,
            monitor: monitorReActivado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la reactivacion de Monitor - Ver logs'
        });
    }
}

module.exports = {
    getMonitores,
    crearMonitor,
    inactivarMonitor,
    buscarMonitorPorId,
    actualizarMonitor,
    reActivarMonitor
}