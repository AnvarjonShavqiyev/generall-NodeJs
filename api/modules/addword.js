const mongoose = require('mongoose');

const addwordsSchema = mongoose.Schema({
    _id:Number,
    eng: String,
    uzb_first: String,
    uzb_second: String,
    trueAnswer: String
});

module.exports = mongoose.model('addWords', addwordsSchema);