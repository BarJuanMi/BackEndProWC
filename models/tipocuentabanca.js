const { Schema, model } = require('mongoose');

const TipoCuentaBancaSchema = new Schema({
    tipocuentabancaId: { type: String },
    tipocuentabancaDesc: { type: String },
}, {
    collection: 'tipocuentabancas'
});

module.exports = model('TipoCuentaBanca', TipoCuentaBancaSchema);