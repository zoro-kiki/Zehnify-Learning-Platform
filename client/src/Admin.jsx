import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiLogOut } from 'react-icons/fi';

const Admin = () => {
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', thumbnailUrl: '', category: 'Development', difficulty: 'Beginner'
    });

    // Token Config
    const getConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/courses');
            // Safety check: Agar data nahi aaya to empty array rakho
            setCourses(res.data.data || []);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses', formData, getConfig());
            alert("Course Added Successfully! 🎉");
            setShowForm(false);
            fetchCourses();
        } catch (err) {
            console.error(err);
            alert("Failed to add course. Are you logged in as Admin?");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}`, getConfig());
            alert("Course Deleted!");
            fetchCourses();
        } catch (err) {
            console.error(err);
            alert("Error deleting course");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 pt-24 transition-colors">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard 🛡️</h1>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-violet-700 shadow-lg"
                    >
                        <FiPlus /> {showForm ? "Close Form" : "Add New Course"}
                    </button>
                </div>

                {/* --- ADD COURSE FORM --- */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl mb-10 border border-gray-200 dark:border-gray-700 animate-fade-in">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 dark:border-gray-700">Create New Course</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <input placeholder="Course Title" className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-violet-500 outline-none" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                            
                            <input placeholder="Image URL (Thumbnail)" className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-violet-500 outline-none" onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})} required />
                            
                            <input placeholder="Price (₹)" type="number" className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-violet-500 outline-none" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                            
                            <select className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-violet-500 outline-none" onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>

                            <textarea placeholder="Description" rows="3" className="col-span-1 md:col-span-2 p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-violet-500 outline-none" onChange={(e) => setFormData({...formData, description: e.target.value})} required />

                            <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md">
                                🚀 Publish Course
                            </button>
                        </form>
                    </div>
                )}

                {/* --- COURSE LIST --- */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm tracking-wider">
                            <tr>
                                <th className="p-4">Thumbnail</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-300">
                            {courses.map(course => (
                                <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="p-4">
                                        <img src={course.thumbnailUrl || 'https://via.placeholder.com/150'} alt="" className="w-16 h-10 object-cover rounded" />
                                    </td>
                                    <td className="p-4 font-semibold">{course.title}</td>
                                    <td className="p-4 font-bold text-green-600">₹{course.price}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(course._id)} 
                                            className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition"
                                            title="Delete Course"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Admin;