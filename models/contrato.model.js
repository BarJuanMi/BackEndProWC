var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contratoSchema = new Schema({
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    emplNomApel: { type: String, required: true },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, default: Date.now },
    tipoContrato: { type: Schema.Types.ObjectId, ref: 'TipoContrato' },
    fechaInicioContrato: { type: Date, required: true },
    fechaFinContrato: { type: Date, required: false },
    observaciones: { type: String, required: false },
    fechaCargoPDF: { type: Date, required: false },
    usuarioCargoPDF: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pathPDF: { type: String, required: false },
    estadoCargoPDF: { type: Boolean, default: false }
}, {
    collection: 'contratos'
});

module.exports = mongoose.model('Contrato', contratoSchema);