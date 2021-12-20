const { Schema, model } = require('mongoose');

const CargoAspiranteSchema = new Schema({
    cargoId: { type: String },
    cargoDesc: { type: String },
}, {
    collection: 'cargoaspirantes'
});

module.exports = model('Cargoaspirante', CargoAspiranteSchema);