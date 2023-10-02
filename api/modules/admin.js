const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    _id: Number,
    username: String,
    password: String
});

module.exports = mongoose.model('Admin', AdminSchema);