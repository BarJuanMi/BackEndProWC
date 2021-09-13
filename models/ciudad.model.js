const { Schema, model } = require('mongoose');

const CiudadSchema = new Schema({
    ciudadId: { type: String },
    ciudadName: { type: String },
}, {
    collection: 'ciudades'
});

module.exports = model('Ciudad', CiudadSchema);