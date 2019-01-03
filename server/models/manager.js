const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let managerSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    lastName: { type: String, required: [true, 'El apellido es requerido'] },
    email: { type: String, required: [true, 'El correo es requerido'], unique: true },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    role: { type: String, default: 'ADMIN_ROLE' }
});

managerSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('Manager', managerSchema);