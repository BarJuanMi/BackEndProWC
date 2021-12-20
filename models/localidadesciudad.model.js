const { Schema, model } = require('mongoose');

const LocalidadSchema = new Schema({
    localidadId: { type: String },
    localidadName: { type: String },
}, {
    collection: 'localidades'
});

module.exports = model('Localidad', LocalidadSchema);