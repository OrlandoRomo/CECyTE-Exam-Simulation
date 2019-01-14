const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const Groups = {
    values: ['A', 'B', 'C', 'D', 'E', 'F', 'Ningúno']
}
const Grades = {
    values: ['1', '2', '3', '4', '5', '6', 'Ningúno']
}
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerido']
    },
    group: {
        type: String,
        enum: Groups,
        default: 'Ningúno'
    },
    grade: {
        type: String,
        enum: Grades,
        default: 'Ningúno'
    },
    role: {
        type: String,
        default: 'USER_ROLE'
    }
});


userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});
module.exports = mongoose.model('User', userSchema);