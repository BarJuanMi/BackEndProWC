const { Schema, model } = require('mongoose');

var servinternetSchema = new Schema({
    proveedor: { type: String, required: true },
    numContratoPago: { type: String, required: true },
    television: { type: Boolean, default: false },
    internet: { type: String, required: true },
    ippublica: { type: String, required: true, default: 'N/A' },
    conxcamaras: { type: Boolean, default: false }
}, {
    collection: 'serviciosinternet'
});

module.exports = model('Serinternet', servinternetSchema);