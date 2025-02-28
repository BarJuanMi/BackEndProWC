const { Schema, model } = require('mongoose');

const EntBancariaSchema = new Schema({
    entbancariaId: { type: String },
    entbancariaDesc: { type: String },
}, {
    collection: 'entbancarias'
});

module.exports = model('EntBancaria', EntBancariaSchema);