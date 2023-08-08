const Auditoria = require('../models/auditoria.model');

const insertarRegAuditoria = async(uid, tipo, complejidad, payload) => {
    try {
        const auditoriaNew = Auditoria({
            usuarioResponsable: uid,
            tipoOperacion: tipo,
            complejidad: complejidad,
            payload: payload,
        });

        await auditoriaNew.save();
    } catch (error) {
        console.log('Error ' + error);
    }
};

module.exports = {
    insertarRegAuditoria
}