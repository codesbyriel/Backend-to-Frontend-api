const mongoose = require("mongoose");

//Schema for storing Register information
const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
});

const UserModel = mongoose.model("RegisteredUsers", UserSchema);

module.exports = UserModel;
