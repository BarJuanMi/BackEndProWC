const { Schema, model } = require('mongoose');

const TipoDocumentoSchema = new Schema({
    tipoDocumentoId: { type: String },
    tipoDocumentoShort: { type: String },
    tipoDocumentoDesc: { type: String },
}, {
    collection: 'tipodocumentos'
});

module.exports = model('Tipodocumento', TipoDocumentoSchema);