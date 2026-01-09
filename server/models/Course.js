const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contentHtml: { type: String },
    videoUrl: { type: String },
    order: { type: Number, default: 0 }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    thumbnailUrl: { type: String },
    lessons: [lessonSchema], // Ye line Lessons ka structure banayegi
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);