const express = require('express');
const router = express.Router();

const user=[];

router.post('/register',async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = user.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    user.push({ fullName, email, password });
    res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;