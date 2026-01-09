const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper Function: Token Generate karne ke liye
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token 30 din tak chalega
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation: Check karo sab kuch bhara hai ya nahi
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // 2. Check karo user pehle se to nahi hai
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Password ko secure (Hash) karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. User create karo
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || 'user', // Default role 'user' hoga agar admin nahi bheja
    });

    // 5. Success response bhejo
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Login token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. User dhundo email se
    const user = await User.findOne({ email });

    // 2. Password match karo
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signupUser, loginUser };