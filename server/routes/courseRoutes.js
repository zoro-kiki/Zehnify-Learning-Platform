const express = require('express');
const router = express.Router();
const Course = require('../models/Course');


const { protect, admin } = require('../middleware/authMiddleware'); 

// 1. GET All Courses (Public)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({ success: true, data: courses });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 2. CREATE Course (🔒 Admin Only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.json({ success: true, message: "Course Created!", data: newCourse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE Course (🔒 Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Course Deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;