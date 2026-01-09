const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'zaara_secret_key_123';

// @route   POST /api/auth/register
// @desc    Register new user & Auto Login
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Check karo user pehle se hai ya nahi
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // 2. Password ko Encrypt karo
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. User save karo
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // 4. TOKEN BANAO (Ye line missing thi pehle, isliye error aaya)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // 5. Success response bhejo (Token aur Name ke saath)
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials (User not found)' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials (Wrong Password)' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;