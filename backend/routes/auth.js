const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library'); 
const client = new OAuth2Client('1069863257043-7uc9vbk8vfndlr91njcu214a36gg8odu.apps.googleusercontent.com'); 


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if ( !email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
          
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET || 'your secrety key',
            { expiresIn: '1h' } 
        );

        res.json({token});
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

   
});


router.post('/google', async (req, res) => {
    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: '1069863257043-7uc9vbk8vfndlr91njcu214a36gg8odu.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const fullName = payload.name;

        let user = await User.findOne({ email });
        if (!user) {
            // Create a new user if not found
            user = new User({
                fullName: fullName || email,
                email,
                password: '', // No password for Google users
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your secrety key',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Google sign-in error:', err);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});


router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const newUser = new User({
            fullName,
            email,
            password : hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;


