const { Schema, model } = require('mongoose');

var aspiranteSchema = new Schema({
    idAspirante: { type: String, },
    documento: { type: String, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    nombApellAspConcat: { type: String, required: true },
    edad: { type: String, required: false },
    email: { type: String, required: false },
    numCelular: { type: String, required: false },
    usuarioCreacion: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    cargoAspirante: { type: Schema.Types.ObjectId, ref: 'Cargoaspirante' },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    notasEntrevistador: { type: String, required: [false, 'El campo de apreciacion es necesario'] },
    direccion: { type: String, required: false },
    localidad: { type: Schema.Types.ObjectId, ref: 'Localidad' },
    experienciaPrevia: { type: Boolean, default: false },
    fechaRegistro: { type: Date, default: Date.now, required: true },
    fechaEntrevista: { type: Date, required: false },
    pathResultadoPDF: { type: String, required: false },
    estadoResCargoPDF: { type: Boolean, default: false, required: false },
    pathHojaVidaPDF: { type: String, required: false },
    estadoHVCargoPDF: { type: Boolean, default: false, required: false }
}, {
    collection: 'aspirantes'
});

module.exports = model('Aspirante', aspiranteSchema);