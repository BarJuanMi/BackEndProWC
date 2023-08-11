const { Schema, model } = require('mongoose');

const TipoCompraFacturaSchema = new Schema({
    tipocomprafactId: { type: String },
    tipocomprafactDesc: { type: String },
}, {
    collection: 'tipocomprafacturas'
});

module.exports = model('TipoCompraFactura', TipoCompraFacturaSchema);