import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlayCircle, FiClock, FiCheckCircle } from "react-icons/fi"; // Professional Icons

const CoursePlayer = () => {
    const { courseId } = useParams();
    
    // 🎥 Mock Data (Jab tak backend se video nahi aati)
    const [currentVideo, setCurrentVideo] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ"); 
    const [activeLesson, setActiveLesson] = useState(0);

    const lessons = [
        { id: 1, title: "Introduction to the Course", duration: "5:20", url: "https://www.youtube.com/embed/SqcY0GlETPk" },
        { id: 2, title: "Setting up the Environment", duration: "10:15", url: "https://www.youtube.com/embed/zJSY8tbf_ys" },
        { id: 3, title: "Understanding React Components", duration: "15:30", url: "https://www.youtube.com/embed/Y6aYx_JcF_k" },
        { id: 4, title: "State and Props Explained", duration: "12:45", url: "https://www.youtube.com/embed/4UZrsTqkcW4" },
        { id: 5, title: "Building Your First Project", duration: "20:00", url: "https://www.youtube.com/embed/w7ejDZ8SWv8" },
    ];

    return (
        // 1. FIXED: Hardcoded 'bg-gray-900' hata diya. Ab ye Theme ke hisab se change hoga.
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            
            {/* Header Strip */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 transition-colors">
                <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:underline"
                >
                    <FiArrowLeft size={20} /> Back to Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                    Full Stack Web Development (Batch 2025)
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                
                {/* LEFT: Video Player Area */}
                {/* Light Mode: Grey bg | Dark Mode: Black bg for focus */}
                <div className="flex-1 bg-gray-100 dark:bg-black flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
                    <div className="w-full max-w-5xl aspect-video bg-black shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                        <iframe 
                            src={currentVideo} 
                            title="Course Video"
                            className="w-full h-full"
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* RIGHT: Syllabus / Playlist */}
                <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors">
                    
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Course Content</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{lessons.length} Lessons</span>
                            <span>•</span>
                            <span>2h 15m Total</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {lessons.map((lesson, index) => (
                            <button 
                                key={lesson.id}
                                onClick={() => {
                                    setCurrentVideo(lesson.url);
                                    setActiveLesson(index);
                                }}
                                className={`flex items-start gap-4 p-4 text-left transition-all border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50
                                    ${activeLesson === index 
                                        ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-l-violet-600' 
                                        : 'border-l-4 border-l-transparent'}`}
                            >
                                {/* Lesson Number */}
                                <div className={`mt-1 font-mono text-sm ${activeLesson === index ? 'text-violet-600 dark:text-violet-400 font-bold' : 'text-gray-400'}`}>
                                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                </div>

                                <div className="flex-1">
                                    <h4 className={`text-sm font-semibold mb-1 ${activeLesson === index ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-200'}`}>
                                        {lesson.title}
                                    </h4>
                                    
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FiPlayCircle /> Video
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiClock /> {lesson.duration}
                                        </span>
                                    </div>
                                </div>

                                {/* Playing Indicator */}
                                {activeLesson === index && (
                                    <FiCheckCircle className="text-violet-600 dark:text-violet-400 mt-1" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CoursePlayer;