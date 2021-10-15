var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vacunadoSchema = new Schema({
    modelo: { type: Schema.Types.ObjectId, ref: 'Modelo' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    farmaceutica: { type: String, required: [true, 'La farmaceutica es necesaria'] },
    fechaPriDosis: { type: Date },
    fechaSecDosis: { type: Date, required: false },
    fechaTerDosis: { type: Date, required: false },
    fechaCuarDosis: { type: Date, required: false },
    regulador: { type: String, required: true },
    estado: { type: String, required: true },
    img: { type: String, required: false }
}, {
    collection: 'vacunados'
});

module.exports = mongoose.model('Vacunado', vacunadoSchema);