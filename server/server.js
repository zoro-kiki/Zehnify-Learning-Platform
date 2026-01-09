require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected (Cloud)'))
    .catch(err => console.log(err));


// --- ROUTES ---
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));


console.log("🔄 Loading Enrollments Route...");
app.use('/api/enrollments', require('./routes/enrollments'));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));