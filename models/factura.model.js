var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = new Schema({
    fechaFactura: { type: Date, required: true },
    montoFactura: { type: Number, default: 0, required: [true, 'El monto es necesario'] },
    grupoFacturas: { type: Boolean, default: false },
    tipoCompraFactura: { type: Schema.Types.ObjectId, ref: 'TipoCompraFactura' },
    vendedorFactura: { type: String, required: false },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    sede: { type: Schema.Types.ObjectId, ref: 'Sede' },
    fechaRegistro: { type: Date, required: true, default: Date.now },
    observaciones: { type: String, required: false },
    retribuible: { type: Boolean, required: false },
    usuarioRetribuible: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    fechaCargueDocsZIP: { type: Date, required: false },
    usuarioCargueDocsZIP: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pathDocsZIP: { type: String, required: false },
    estadoCargueDocsZIP: { type: Boolean, default: false },
}, {
    collection: 'facturas'
});

module.exports = mongoose.model('Factura', facturaSchema);