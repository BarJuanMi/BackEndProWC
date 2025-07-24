const { Schema, model } = require('mongoose');

var rhValido = {
    values: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'N/A'],
    message: '{VALUE} no es un rh permitido'
}

var generoValido = {
    values: ['FEMENINO', 'MASCULINO', 'INDETERMINADO'],
    message: '{VALUE} no es un genero permitido'
}

const EmpleadoSchema = new Schema({
    documento: { type: String, unique: true, required: [true, 'El numero de documento es necesario'] },
    tipoDocumento: { type: Schema.Types.ObjectId, ref: 'Tipodocumento' },
    genero: { type: String, required: true, default: 'FEMENINO', enum: generoValido },
    nombres: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'El apellido es necesario'] },
    nombApellConca: { type: String, required: [true, 'La concatenacion de nombres y apellidos es necesario'] },
    tipoEmpleado: { type: Schema.Types.ObjectId, ref: 'Tipoempleado' },
    fechaNac: { type: Date, required: [true, 'La fecha de nacimiento es necesaria'] },
    direccion: { type: String, required: [true, 'La direccion de residencia es necesaria'] },
    emailCorporativo: { type: String, required: [true, 'La direccion de email es necesaria'] },
    telCelular: { type: String, required: [true, 'La telefóno celular es necesario'] },
    rh: { type: String, required: true, default: 'O+', enum: rhValido },
    nomContEmer: { type: String, required: [true, 'El nombre del contacto de emergencia es necesario'] },
    telContEmer: { type: String, required: [true, 'El telefono del contacto de emergencia es necesario'] },
    fechaIngreso: { type: Date, required: [true, 'La fecha de ingreso es necesaria'] },
    estado: { type: Boolean, default: true },
    numHijos: { type: Number, default: 0, },
    nacionalidad: { type: Schema.Types.ObjectId, ref: 'Pais' },
    ciudadResidencia: { type: Schema.Types.ObjectId, ref: 'Ciudad' },
    img: { type: String, required: false },
    numHuellero: { type: Number, required: false },
    fechaInactivacion: { type: Date },
    fechaCreacionApp: { type: Date, default: Date.now },
    usuarioCreacion: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    epsSalud: { type: Schema.Types.ObjectId, ref: 'Eps' },
    arlTrabajo: { type: Schema.Types.ObjectId, ref: 'Arl' },
}, {
    collection: 'empleados'
});

module.exports = model('Empleado', EmpleadoSchema);