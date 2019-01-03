const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let testSchema = new Schema({
    correctAnswers: { type: Number },
    incorrectAnswers: { type: Number },
    timer: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Test', testSchema);