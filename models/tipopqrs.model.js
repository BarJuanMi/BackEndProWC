const { Schema, model } = require('mongoose');

const TipoPQRSSchema = new Schema({
    tipopqrsId: { type: String },
    tipopqrsDesc: { type: String }
}, {
    collection: 'tipopqrs'
});

module.exports = model('TipoPQRS', TipoPQRSSchema);