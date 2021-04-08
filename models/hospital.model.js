const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: { type: String, required: true },
    img: { type: String },
    usuario: { required: true, type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

// Esto { __v, _id, password, ...object }
// no permite que se extraiga lo que esta 
// entre los corchetes, es decir ignora todo eso
HospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);