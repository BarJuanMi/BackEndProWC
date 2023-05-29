const { Schema, model } = require('mongoose');

const CausalRetiroSchema = new Schema({
    causalretiroId: { type: String },
    causalretiroDesc: { type: String },
}, {
    collection: 'causalretiros'
});

module.exports = model('CausalRetiro', CausalRetiroSchema);