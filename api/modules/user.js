const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    phoneNumber: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    extra:{
        payment: false,
        score: 0,
        levelsWord: 0,
        levelsTest: 0
    }
});

module.exports = mongoose.model('User', userSchema);