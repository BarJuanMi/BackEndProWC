var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var certbancariaSchema = new Schema({
    numCuentaBanco: { type: String, required: true },
    emisorCuentaBanco: { type: String, required: true },
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    emplNomApel: { type: String, required: true },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, default: Date.now },
    fechaCargoPDF: { type: Date, required: false },
    usuarioCargoPDF: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pathPDF: { type: String, required: false },
    estadoCargoPDF: { type: Boolean, default: false },
}, {
    collection: 'certbancaria'
});

module.exports = mongoose.model('CertBancaria', certbancariaSchema);