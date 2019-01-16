const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let categorySchema = new Schema({
    nameCategory: { type: String, required: [true, 'El nombre es requerido'], unique: true },
    enable: { type: Boolean, default: true }
});

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('Category', categorySchema);