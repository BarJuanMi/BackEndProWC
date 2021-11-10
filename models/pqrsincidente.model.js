const { Schema, model } = require('mongoose');

var pqrsincidenteSchema = new Schema({
    tipo: { type: Schema.Types.ObjectId, ref: 'TipoPQRS' },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    usuarioAsignado: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, default: Date.now },
    detallePrimario: { type: String, required: [true, 'El detalle es necesario'] },
    modeloAsociado: { type: Schema.Types.ObjectId, required: false, ref: 'Modelo' },
    prioridad: { type: String, required: true, default: 'NORMAL' },
    estado: { type: String, required: true, default: 'ABIERTO' },
    fechaOcurrencia: { type: String, required: false },
    respuestaAsociada: { type: String, required: false },
    img: { type: String, required: false }
}, {
    collection: 'pqrsincidentes'
});

module.exports = model('PQRSIncidente', pqrsincidenteSchema);