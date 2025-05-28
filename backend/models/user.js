const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String // hashed password
});

module.exports = mongoose.model('User', UserSchema);


