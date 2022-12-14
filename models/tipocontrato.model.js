const { Schema, model } = require('mongoose');

const TipoContratoSchema = new Schema({
    tipocontratoId: { type: String },
    tipocontratoDesc: { type: String },
}, {
    collection: 'tipocontratos'
});

module.exports = model('TipoContrato', TipoContratoSchema);