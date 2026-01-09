const Course = require('../models/Course');

// @desc    Sare courses fetch karne ke liye (Read Operation) - Public
// @route   GET /api/courses
const getCourses = async (req, res) => {
    try {
        // Database se saare courses find kar rahe hain, koi filter nahi lagaya
        const courses = await Course.find({});

        // Check kar rahe hain ki course list khali toh nahi hai
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Abhi database pura khali hai, koi course nahi mila."
            });
        }

        // Agar sab sahi raha toh courses return kar denge
        res.status(200).json({
            success: true,
            count: courses.length, // total kitne courses hai count bhejna acha hota hai
            data: courses,
        });

    } catch (error) {
        // Agar server side koi issue aaya toh yaha error catch hoga
        res.status(500).json({
            success: false,
            error: "Server error aa gaya courses load karte time.",
        });
    }
};

// @desc    Ek single course dikhao (Public)
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Naya Course  (Admin Only)
// @route   POST /api/courses
const createCourse = async (req, res) => {
    try {
        const { title, description, price, category, difficulty, thumbnailUrl, lessons } = req.body;

        // Slug banana (title se URL friendly version. Ex: "React Course" -> "react-course")
        const slug = title.toLowerCase().split(' ').join('-');

        const course = new Course({
            title,
            slug,
            description,
            price,
            category,
            difficulty,
            thumbnailUrl,
            lessons // Array of lessons
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Course update karne ke liye (Put Request)
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
    try {
        // Pehle id se dhund rahe hai ki course hai bhi ya nahi
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course nahi mila update karne ke liye." });
        }

        // Yahan update kar rahe hai. 'new: true' isliye lagaya taki update hone k baad purana nahi, naya data return ho
        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true // Ye check karega ki data sahi format me hai ya nahi
        });

        res.status(200).json({
            success: true,
            data: course
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Course delete karne ke liye
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
    try {
        // Pehle check karte hain course exist karta hai ya nahi
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course mila hi nahi delete karne ke liye." });
        }

        // Agar mil gaya, toh uda do (Delete kardo)
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Course successfully delete ho gaya."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// End mein saare functions ko export kar rahe hain taaki routes mein use kar sakein
module.exports = {
    getCourses, getCourseById, createCourse,
    updateCourse , deleteCourse
};