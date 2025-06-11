// Mongoose model for representing users in the e-commerce application
// This schema defines the structure of the user collection in MongoDB, including authentication and authorization logic

const mongoose = require('mongoose'); // Import mongoose for schema and model creation
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing and comparison

const UserSchema = new mongoose.Schema({
  // Full name of the user
  fullName: { type: String, required: true },
  // Unique email address for the user (used for login)
  email:    { type: String, required: true, unique: true },
  // Hashed password for authentication
  password: { type: String, required: true },
  // Role of the user (either 'user' or 'admin'), defaults to 'user'
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Pre-save middleware to hash the password before saving the user document
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  // Hash the password with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method to compare a candidate password with the stored hashed password
UserSchema.methods.comparePassword = function(candidatePassword) {
  // Returns a promise that resolves to true if passwords match, false otherwise
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model for use in authentication and user management
module.exports = mongoose.model('User', UserSchema);