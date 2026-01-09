console.log("✅ Enrollments Route File Loaded!");
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course'); // Course ki details lane ke liye

// 1. Enroll in a Course (Buy)
router.post('/', async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Check karo pehle se khareeda hai ya nahi?
        const existing = await Enrollment.findOne({ userId, courseId });
        if (existing) {
            return res.status(400).json({ error: 'You are already enrolled in this course.' });
        }

        // Naya enrollment banao
        const newEnrollment = new Enrollment({ userId, courseId });
        await newEnrollment.save();

        res.json({ success: true, message: 'Enrolled successfully! 🎉' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// 2. Get My Enrolled Courses (Dashboard ke liye)
router.get('/:userId', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.params.userId })
            .populate('courseId'); // <-- Magic! Ye Course ki poori details (Name, Image) le aayega

        res.json({ success: true, data: enrollments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;