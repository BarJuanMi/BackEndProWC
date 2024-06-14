var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = new Schema({
    fechaFactura: { type: Date, required: true },
    montoFactura: { type: Number, default: 0, required: [true, 'El monto es necesario'] },
    grupoFacturas: { type: Boolean, default: false },
    tipoCompraFactura: { type: Schema.Types.ObjectId, ref: 'TipoCompraFactura' },
    vendedorFactura: { type: String, required: false },
    observaciones: { type: String, required: false },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaRegistro: { type: Date, required: true, default: Date.now },
    fechaCargoPDF: { type: Date, required: false },
    usuarioCargoPDF: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pathPDF: { type: String, required: false },
    estadoCargoPDF: { type: Boolean, default: false },
    fechaCargueDocsZIP: { type: Date, required: false },
    usuarioCargueDocsZIP: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pathDocsZIP: { type: String, required: false },
    estadoCargueDocsZIP: { type: Boolean, default: false },
}, {
    collection: 'facturas'
});

module.exports = mongoose.model('Factura', facturaSchema);