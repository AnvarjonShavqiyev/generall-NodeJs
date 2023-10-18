const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: String,
  phoneNumber: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  extra: "false",
});

module.exports = mongoose.model("User", userSchema);
