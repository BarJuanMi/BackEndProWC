const { Schema, model } = require('mongoose');

const TipoEmpleadoSchema = new Schema({
    tipoEmpleadoId: { type: String },
    tipoEmpleadoDesc: { type: String },
}, {
    collection: 'tipoempleados'
});

module.exports = model('Tipoempleado', TipoEmpleadoSchema);