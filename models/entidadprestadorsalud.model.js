const { Schema, model } = require('mongoose');

const EPSSchema = new Schema({
    epsId: { type: String },
    epsDesc: { type: String },
}, {
    collection: 'listaeps'
});

module.exports = model('Eps', EPSSchema);