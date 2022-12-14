var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ausentismoSchema = new Schema({
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    tipoAusentismo: { type: Schema.Types.ObjectId, ref: 'TipoAusentismo' },
    fechaInicio: { type: Date, required: true },
    fechaFinalizacion: { type: Date, required: false },
    emplNomApel: { type: String, required: true },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, default: Date.now },
    obserAprobRecha: { type: String, required: false },
    fechaAprobRecha: { type: Date, required: false },
    usuarioAprobRecha: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaCargoPDF: { type: Date, required: false },
    usuarioCargoPDF: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pathPDF: { type: String, required: false },
    estadoCargoPDF: { type: Boolean, default: false }
}, {
    collection: 'ausentismos'
});

module.exports = mongoose.model('Ausentismo', ausentismoSchema);