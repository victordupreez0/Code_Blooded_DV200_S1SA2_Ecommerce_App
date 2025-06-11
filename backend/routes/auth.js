// Express router for handling user authentication (register and login) in the e-commerce application
// Provides endpoints for user registration and login, issues JWT tokens for authenticated sessions

const express = require('express'); // Import express for routing
const router = express.Router(); // Create a new router instance
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT operations
const User = require('../models/user.js'); // Import the User model for database operations

// Register endpoint: creates a new user and returns a JWT token
router.post('/register', async (req, res) => {
  try {
    // Extract registration fields from the request body
    const { fullName, email, password } = req.body;
    // Validate that all required fields are provided
    if (!fullName || !email || !password) return res.status(400).json({ message: 'All fields required' });
    // Check if a user with the given email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    // Create a new user instance
    const user = new User({ fullName, email, password });
    // Save the new user to the database (password will be hashed by pre-save middleware)
    await user.save();
    // Generate a JWT token containing userId, fullName, and role, valid for 1 day
    const token = jwt.sign(
      { userId: user._id, fullName: user.fullName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('Register successful, generated token:', token); // Debug: log the generated token
    // Respond with the token and user info (excluding password)
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    // Handle errors during registration
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint: authenticates a user and returns a JWT token
router.post('/login', async (req, res) => {
  try {
    // Extract login credentials from the request body
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });
    // If user not found or password does not match, return 401 Unauthorized
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', { _id: user._id, email: user.email }); // Debug: log user info
    // Generate a JWT token containing userId, fullName, and role, valid for 1 day
    const token = jwt.sign(
      { userId: user._id, fullName: user.fullName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('Generated token:', token); // Debug: log the generated token
    // Respond with the token and user info (excluding password)
    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    // Handle errors during login
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Export the router for use in the main server
module.exports = router;