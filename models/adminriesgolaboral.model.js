const { Schema, model } = require('mongoose');

const ARLSchema = new Schema({
    arlId: { type: String },
    arlDesc: { type: String },
}, {
    collection: 'listaarls'
});

module.exports = model('Arl', ARLSchema);