const { response } = require('express');
const CertBancaria = require('../models/certbancaria.model');
const Empleado = require('../models/empleado.model');
const Usuario = require('../models/usuario.model');

/**
 * Operación para obtener todos las certificaciones usando el desde como 
 * condicion inicial de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getCertBancarias = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 10 en adelante, recordar que le numeracion comienza en 0
    const [certbancarias, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        CertBancaria.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('empleado', 'documento nombApellConca emailCorporativo')
        .populate('usuarioRegistro', 'nombre')
        .populate('usuarioCargoPDF', 'nombre')
        .populate('tipoCuentaBanco', 'tipocuentabancaId tipocuentabancaDesc')
        .populate('emisorCuentaBanco', 'entbancariaId entbancariaDesc')
        .sort({ emplNomApel: 1 })
        .limit(Number(process.env.LIMIT_QUERY_CERTIFICACIONES)),

        //Promesa 2
        CertBancaria.countDocuments()
    ]);

    res.json({
        status: true,
        certbancarias,
        total
    })
}

/**
 * Operación para crear una nueva Certificacion Bancaria dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegCertBancaria = async(req, res = response) => {
    try {
        console.log(req.body);

        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        req.body.usuario = uid;

        const certBancariaNew = new CertBancaria({
            usuarioRegistro: uid,
            ...req.body
        });

        const idEmpleadoDB = await Empleado.findById(req.body.empleado);

        const certBancaValida = await CertBancaria.findOne({ empleado: idEmpleadoDB });

        if (certBancaValida == null) {
            certBancariaNew.emplNomApel = String(idEmpleadoDB.nombres).toUpperCase() + ' ' + String(idEmpleadoDB.apellidos).toUpperCase();

            const certBancariaRet = await certBancariaNew.save();

            res.json({
                status: true,
                certBancariaRet,
                msg: 'Registro de Certificacion Bancaria Creado Satisfactoriamente'
            });
        } else {
            res.json({
                status: false,
                msg: 'No es posible crear un nuevo Registro de Certificacion Bancaria, este empleado ya tiene uno vigente, para continuar borre el anterior.'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la creación del registro de Certificacion Bancaria - Ver logs'
        });
    }
}

/**
 * Operación para obtener una Certificacion Bancaria mediante su ID dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarRegCertBancariaId = async(req, res = response) => {

    const idCertBancaria = req.params.id;
    try {
        const certBancariaRet = await CertBancaria
            .findById(idCertBancaria)
            .populate('empleado', 'documento nombApellConca emailCorporativo')
            .populate('usuarioRegistro', 'nombre')
            .populate('usuarioCargoPDF', 'nombre')
            .populate('tipoCuentaBanco', 'tipocuentabancaId tipocuentabancaDesc')
            .populate('emisorCuentaBanco', 'entbancariaId entbancariaDesc')

        if (!certBancariaRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de certificacion bancaria con ese id'
            });
        }

        res.json({
            status: true,
            certbancaria: certBancariaRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la busqueda particular del registro de certificacion bancaria - Ver logs'
        });
    }
}

/**
 * Operación para actualizar la Certificacion Bancaria dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const actualizarRegCertBancaria = async(req, res = response) => {

    const uid = req.uid;
    const idCertBancaria = req.params.id;
    try {
        const resCertBancariaDB = await CertBancaria.findById(idCertBancaria);

        if (!resCertBancariaDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de certificacion bancaria con ese id'
            });
        }

        const {...campos } = req.body;

        const certBancariaActualizado = await CertBancaria.findByIdAndUpdate(idCertBancaria, campos, { new: true });

        res.json({
            status: true,
            certbancaria: certBancariaActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualizacion del registro de certificacion bancaria - Ver logs'
        });
    }
}

/**
 * Operación para eliminar fisicamente una Certificacion Bancaria del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const eliminarRegCertBancaria = async(req, res = response) => {

    const idCertBancaria = req.params.id;
    try {
        const resCertBancariaDB = await CertBancaria.findById(idCertBancaria);

        if (!resCertBancariaDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de certificacion bancaria con ese id'
            });
        }

        const certBancariaEliminado = await CertBancaria.findByIdAndDelete(idCertBancaria);

        res.json({
            status: true,
            msg: 'Registro de certificacion bancaria eliminado correctamente',
            certBancaria: certBancariaEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del registro de certificacion bancaria - Ver logs'
        });
    }
}

/*const borrarPDF = (adjuntoPath) => {
    if (fs.existsSync(adjuntoPath)) {
        fs.unlinkSync(adjuntoPath);
    }
}*/

module.exports = {
    getCertBancarias,
    crearRegCertBancaria,
    buscarRegCertBancariaId,
    actualizarRegCertBancaria,
    eliminarRegCertBancaria
}