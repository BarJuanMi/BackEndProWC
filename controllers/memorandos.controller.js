const { response } = require('express');
const Memorando = require('../models/memorando.model');
const Empleado = require('../models/empleado.model');
const Usuario = require('../models/usuario.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los memorandos usando el desde como 
 * condicion inicial de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getMemorandos = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 10 en adelante, recordar que le numeracion comienza en 0
    const [memorandos, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Memorando.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('empleado', 'documento nombApellConca')
        .populate('usuarioRegistro', 'nombre')
        .populate('usuarioAprobRecha', 'nombre')
        .sort({ fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_MEMORANDOS)),

        //Promesa 2
        Memorando.countDocuments()
    ]);

    res.json({
        status: true,
        memorandos,
        total
    })
}

/**
 * Operación para crear un nuevo memorando dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegMemorando = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        req.body.usuario = uid;

        const memorandoNew = new Memorando({
            usuarioRegistro: uid,
            ...req.body
        });

        const idEmpleadoDB = await Empleado.findById(req.body.empleado);

        memorandoNew.fechaEvento = addHoursDate(req.body.fechaEvento);
        memorandoNew.emplNomApel = String(idEmpleadoDB.nombres).toUpperCase() + ' ' + String(idEmpleadoDB.apellidos).toUpperCase();

        const memorandoRet = await memorandoNew.save();

        res.json({
            status: true,
            memorandoRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la creación del registro de memorando - Ver logs'
        });
    }
}

/**
 * Operación para obtener un memorando mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarRegMemorandoId = async(req, res = response) => {

    const idMemorando = req.params.id;
    try {
        const memorandoRet = await Memorando
            .findById(idMemorando)
            .populate('empleado', 'documento nombApellConca')
            .populate('usuarioRegistro', 'nombre')
            .populate('usuarioCargoPDF', 'nombre')

        if (!memorandoRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de memorando con ese id'
            });
        }

        res.json({
            status: true,
            memorando: memorandoRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la busqueda particular del registro de memorando - Ver logs'
        });
    }
}

/**
 * Operación para actualizar el memeorando dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const actualizarRegMemorando = async(req, res = response) => {

    const uid = req.uid;
    const idMemorando = req.params.id;
    try {
        const resMemorandoDB = await Memorando.findById(idMemorando);

        if (!resMemorandoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de memorando con ese id'
            });
        }

        const {...campos } = req.body;

        const memorandoActualizado = await Memorando.findByIdAndUpdate(idMemorando, campos, { new: true });

        res.json({
            status: true,
            memorando: memorandoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualizacion del registro de memorando - Ver logs'
        });
    }
}

/**
 * Operación para eliminar fisicamente un memorando del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const eliminarRegMemorando = async(req, res = response) => {

    const idMemorando = req.params.id;
    try {
        const resMemorandoDB = await Memorando.findById(idMemorando);

        if (!resMemorandoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de memorando con ese id'
            });
        }

        const memorandoEliminado = await Memorando.findByIdAndDelete(idMemorando);

        res.json({
            status: true,
            msg: 'Registro de memorando eliminado correctamente',
            memorando: memorandoEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del registro de memorando - Ver logs'
        });
    }
}

const borrarPDF = (adjuntoPath) => {
    if (fs.existsSync(adjuntoPath)) {
        fs.unlinkSync(adjuntoPath);
    }
}

module.exports = {
    getMemorandos,
    crearRegMemorando,
    buscarRegMemorandoId,
    actualizarRegMemorando,
    eliminarRegMemorando
}