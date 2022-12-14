var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memorandoSchema = new Schema({
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    emplNomApel: { type: String, required: true },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, default: Date.now },
    descripcion: { type: String, required: true },
    normaInfringida: { type: String, required: false },
    posiblesConsecuencias: { type: String, required: false },
    fechaEvento: { type: Date, required: false },
    respuestaDeMemo: { type: String, required: false },
    fechaCargoPDF: { type: Date, required: false },
    usuarioCargoPDF: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pathPDF: { type: String, required: false },
    estadoCargoPDF: { type: Boolean, default: false }
}, {
    collection: 'memorandos'
});

module.exports = mongoose.model('Memorando', memorandoSchema);