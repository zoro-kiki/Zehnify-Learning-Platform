const authRoutes = require('./routes/authRoutes');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes');
// Configuration load karna
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Routes Use Karna
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
// Database Connection Function
const connectDB = async () => {
    try {
        // Database se connect karna
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1); // Agar error aaye to band kar do
    }
};

// Pehle DB connect karo, phir server start karo
connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send('API is running... Database Connected!');
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server ${PORT} port par start ho gaya hai!`);
    });
});