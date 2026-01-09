import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
    // 1. STATE MANAGEMENT
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // LocalStorage se naam uthao
    const userName = localStorage.getItem('userName') || "Student";

    const userId = localStorage.getItem('userId');

    // 2. FETCH DATA FROM API
    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/enrollments/${userId}`);
                const result = await response.json();

                if (result.success) {
                    setCourses(result.data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors pt-10">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Welcome back, <span className="font-semibold text-violet-600 dark:text-violet-400">{userName}</span>! Ready to learn? 🚀
                    </p>
                </div>

                {/* Stats Grid - DYNAMIC DATA */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card 1: Enrolled (Ab ye automatic count dikhayega) */}
                    <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl text-2xl">📚</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {loading ? "..." : courses.length}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Enrolled Courses</p>
                        </div>
                    </motion.div>

                    {/* Card 2: Progress (Placeholder) */}
                    <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl text-2xl">🔥</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">0%</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Overall Progress</p>
                        </div>
                    </motion.div>

                    {/* Card 3: Certificates (Placeholder) */}
                    <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-xl text-2xl">🏆</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">0</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Certificates Earned</p>
                        </div>
                    </motion.div>
                </div>

                {/* My Courses Section */}
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Learning</h2>
                    <Link to="/courses" className="text-violet-600 font-medium hover:underline text-sm">View All Courses →</Link>
                </div>

                {/* LOGIC: Loading -> Empty -> List */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading your courses...</p>
                ) : courses.length === 0 ? (

                    /* EMPTY STATE (Jab koi course na ho) */
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🌱</div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Start your learning journey</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            You are not enrolled in any courses yet.
                        </p>
                        <Link to="/courses" className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg">
                            Explore Courses
                        </Link>
                    </div>

                ) : (

                    /* COURSE LIST (Jab courses mil jayein) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={item.courseId.thumbnailUrl || 'https://via.placeholder.com/300'}
                                    alt={item.courseId.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">{item.courseId.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.courseId.description}</p>

                                    <Link
                                        to={`/learn/${item.courseId._id}`}
                                        className="block w-full text-center bg-violet-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-violet-700 transition mt-4 shadow-md"
                                    >
                                        Continue Learning ▶
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;