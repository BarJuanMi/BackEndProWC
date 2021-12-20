var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vacunadoSchema = new Schema({
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    farmaceutica: { type: String, required: [true, 'La farmaceutica es necesaria'] },
    fechaPriDosis: { type: Date },
    fechaSecDosis: { type: Date, required: false },
    fechaTerDosis: { type: Date, required: false },
    fechaCuarDosis: { type: Date, required: false },
    regulador: { type: String, required: true },
    img: { type: String, required: false }
}, {
    collection: 'vacunados'
});

module.exports = mongoose.model('Vacunado', vacunadoSchema);