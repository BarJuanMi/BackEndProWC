var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var auditoriaSchema = new Schema({
    usuarioResponsable: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    tipoOperacion: { type: String, required: true },
    fechaOperacion: { type: Date, required: true, default: Date.now },
    complejidad: { type: String, required: true },
    payload: { type: String, required: false },
}, {
    collection: 'auditorias'
});

module.exports = mongoose.model('Auditoria', auditoriaSchema);