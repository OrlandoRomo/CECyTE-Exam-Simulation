const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let questionSchema = new Schema({
    questionDescription: { type: String, required: [true, 'La pregunta es necesaria'], unique: true },
    options: [{ type: String, unique: true }],
    correctOption: { type: String, unique: true },
    manager: { type: Schema.Types.ObjectId, ref: 'Manager' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    imgs: [{ type: String, require: false }]
});

questionSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('Question', questionSchema);