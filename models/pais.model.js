const { Schema, model } = require('mongoose');

const PaisSchema = new Schema({
    countryId: { type: String },
    countryCode: { type: String },
    countryName: { type: String },
}, {
    collection: 'paises'
});

module.exports = model('Pais', PaisSchema);