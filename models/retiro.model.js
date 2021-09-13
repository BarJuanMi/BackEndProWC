const { Schema, model } = require('mongoose');

var retiroSchema = new Schema({
    modelo: { type: Schema.Types.ObjectId, ref: 'Modelo' },
    usuarioCreacion: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRenuncia: { type: Date, required: false },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    motivoRetiro: { type: String, required: [true, 'El motivo es necesario'] },
    entrevista: { type: Boolean, default: false },
    encuesta: { type: Boolean, default: false },
    fechaRegistro: { type: Date, default: Date.now },

    fechaFirma: { type: String, required: false },
    fechaCargoPDF: { type: Date, required: false },
    usuarioCargoPDF: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pdf: { type: String, required: false },
}, {
    collection: 'retiros'
});

module.exports = model('Retiro', retiroSchema);