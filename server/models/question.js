const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
const Schema = mongoose.Schema;
//Validate only the question description
const uniqueValidator = require('mongoose-unique-validator');

//Fetch random documents
const random = require('mongoose-simple-random');

let questionSchema = new Schema({
    questionDescription: { type: String, required: [true, 'La pregunta es necesaria'], unique: true },
    options: [{ type: String, unique: false }],
    correctOption: { type: String, unique: false },
    manager: { type: Schema.Types.ObjectId, ref: 'Manager' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    imgs: [{ type: String, require: false }]
});

questionSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});
questionSchema.plugin(random);
module.exports = mongoose.model('Question', questionSchema);