const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Login Check (Protect)
const protect = async (req, res, next) => {
    let token;

    // Check karo agar header mein token hai
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer <token>" se token nikalo
            token = req.headers.authorization.split(' ')[1];

            // Verify karo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User dhoond ke req.user mein daal do
            req.user = await User.findById(decoded.id).select('-passwordHash');

            next(); // Sab sahi hai, aage badho
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. Admin Check
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Admin hai, aage badho
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };