const { Schema, model } = require('mongoose');

var servlavanderiaSchema = new Schema({
    cantidadColchas: { type: Number, required: true, default: 0 },
    sede: { type: Schema.Types.ObjectId, ref: 'Sede' },
    estado: { type: String, required: false, default: 'EN LA LAVANDERIA' },
    fechaSalidaColchas: { type: Date, required: false },
    fechaEntregaColchas: { type: Date, required: false },
    obsSalidaColchas: { type: String, required: false, default: 'N/A' },
    obsEntregaColchas: { type: String, required: false, default: 'N/A' },
    recibeSatisfaccion: { type: Boolean, default: false },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, default: Date.now },
    img: { type: String, required: false }
}, {
    collection: 'servlavanderias'
});

module.exports = model('Servlavanderia', servlavanderiaSchema);