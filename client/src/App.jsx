import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// --- ICONS IMPORT ---
import { FaGithub, FaRocket } from "react-icons/fa";
import {
  FiSun, FiMoon, FiUser, FiLogOut, FiGrid, FiBook,
  FiChevronDown, FiCheckCircle, FiMail, FiLock, FiEye, FiEyeOff, FiTarget
} from "react-icons/fi";

// --- PAGE IMPORTS ---
import Dashboard from './Dashboard';
import CoursePlayer from './CoursePlayer';
import Admin from './Admin';

// --- THEME TOGGLE BUTTON ---
const ThemeToggle = ({ darkMode, setDarkMode }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 transition-all shadow-sm hover:scale-110 border border-gray-200 dark:border-gray-700"
  >
    {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
  </button>
);

// --- COMPONENTS ---

// 1. Home Page
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 text-center transition-colors duration-300">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl"
    >
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-6 tracking-tight drop-shadow-sm py-2">
        Zehnify
      </h1>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6"
      >
        Shape Your Mind.
      </motion.h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        Turn Learning into Power. Experience a unique way to learn, think, and grow.
      </p>
      <Link to="/courses">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-violet-600 dark:bg-violet-500 text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition border-2 border-transparent hover:border-white/20"
        >
          Start Learning
        </motion.button>
      </Link>
    </motion.div>
  </div>
);


// 2. Courses Page
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://zehnify-learning-platform.onrender.com/api/courses');
        setCourses(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!userId) {
      alert("Please Login to Enroll!");
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post('https://zehnify-learning-platform.onrender.com/api/enrollments', {
        userId,
        courseId
      });

      if (res.data.success) {
        alert("🎉 Course Enrolled Successfully! Check Dashboard.");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Enrollment Failed");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen transition-colors duration-300 pt-24">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-12 text-gray-800 dark:text-white border-b-4 border-violet-500 pb-2 inline-block"
      >
        Available Courses
      </motion.h2>

      {loading ? (
        <p className="text-center text-xl text-gray-500 dark:text-gray-400">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {courses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No courses found yet.</p>
          ) : (
            courses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full"
              >
                <img
                  src={course.thumbnailUrl || "https://via.placeholder.com/300"}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-6 flex flex-col flex-grow">
                  <span className={`text-xs px-3 py-1 w-fit rounded-full font-bold uppercase mb-3 ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {course.difficulty}
                  </span>

                  <h3 className="font-bold text-2xl mb-2 text-gray-800 dark:text-white line-clamp-2">{course.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="font-bold text-2xl text-violet-600 dark:text-violet-400">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </span>

                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-full font-bold hover:scale-105 transition shadow-lg"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// 3. About Page
const About = () => (
  <div className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 text-center"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
        Hi, I'm <span className="text-violet-600">Zaara</span>.
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-10">
        Full Stack Developer & Creator of Zehnify
      </p>

      <div className="text-left bg-violet-50 dark:bg-gray-700/50 p-8 rounded-2xl mb-10 border border-violet-100 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          Building with Purpose <FaRocket className="text-violet-600" />
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          I built <strong>Zehnify</strong> to make learning calm, focused, and practical.
          No noise, just clear concepts. I love bridging the gap between beautiful design and powerful logic.
        </p>
        <ul className="space-y-3 text-gray-600 dark:text-gray-300 font-medium">
          <li className="flex items-center gap-3">
            <FiCheckCircle className="text-green-500 text-xl" />
            No noise, only clarity
          </li>
          <li className="flex items-center gap-3">
            <FiCheckCircle className="text-green-500 text-xl" />
            Skills that actually matter
          </li>
        </ul>
      </div>

      <div className="flex justify-center mb-12">
        <a
          href="https://github.com/zoro-kiki"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-full font-bold transition shadow-lg transform hover:-translate-y-1"
        >
          <FaGithub className="text-2xl transition-transform group-hover:rotate-12" />
          GitHub
        </a>
      </div>


      <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium uppercase tracking-widest mb-2">
          Contact Me
        </p>
        <a href="mailto:zaarakhn07@gmail.com" className="text-xl font-bold text-violet-600 dark:text-violet-400 hover:underline">
          zaarakhn07@gmail.com
        </a>
      </div>
    </motion.div>
  </div>
);

// 4. Login Page
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://zehnify-learning-platform.onrender.com/api/auth/login",
        formData
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem('userId', res.data.user.id);

        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border dark:border-gray-700">

        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Login to <span className="font-semibold text-violet-600">Zehnify</span>
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-12 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-lg active:scale-95"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          New here?{" "}
          <Link to="/signup" className="font-bold text-violet-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

// 5. Signup Page
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (!/\d/.test(formData.password)) {
      setError("Password must contain at least one number.");
      return false;
    }
    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError("Password must contain at least one special character.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "https://zehnify-learning-platform.onrender.com/api/auth/register",
        formData
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem('userId', res.data.user.id);
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border dark:border-gray-700">

        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Join <span className="font-semibold text-violet-600">Zehnify</span>
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-12 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-lg active:scale-95"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-violet-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

        {/* Navigation Bar */}
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">

              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-violet-700 dark:text-violet-400 tracking-wide">
                  Zehnify<span className="text-gray-400 text-3xl">.</span>
                </Link>

                <div className="hidden md:flex ml-10 space-x-8">
                  <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 px-3 py-2 rounded-md font-medium transition">Home</Link>
                  <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 px-3 py-2 rounded-md font-medium transition">Courses</Link>
                  <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 px-3 py-2 rounded-md font-medium transition">About</Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

                {/* --- LOGIC: User Dropdown (Replaced old button) --- */}
                {localStorage.getItem('token') ? (
                  <div className="flex items-center gap-4">

                    {/* Dropdown Container */}
                    <div className="relative group">

                      {/* Trigger Button */}
                      <button className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium hover:text-violet-600 transition py-2">
                        <span className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 p-1.5 rounded-full">
                          <FiUser size={16} />
                        </span>
                        Hi, {localStorage.getItem('userName') || 'User'}
                        <FiChevronDown className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-0 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hidden group-hover:block z-50 transform origin-top transition-all animation-fade-in">

                        {/* Menu Items */}
                        <Link to="/dashboard" className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-gray-700 hover:text-violet-600 transition flex items-center gap-3">
                          <FiGrid /> Dashboard
                        </Link>

                        <Link to="/courses" className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-gray-700 hover:text-violet-600 transition flex items-center gap-3">
                          <FiBook /> My Courses
                        </Link>

                        {/* Divider Line */}
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                          }}
                          className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-3"
                        >
                          <FiLogOut /> Logout
                        </button>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Login Buttons */
                  <div className="flex gap-4">
                    <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 font-medium transition py-2">Log in</Link>
                    <Link to="/signup" className="bg-violet-600 text-white px-4 py-2 rounded-md font-medium hover:bg-violet-700 transition shadow-lg shadow-violet-500/20">Sign up</Link>
                  </div>
                )}

              </div>
            </div>
          </div>
        </nav>

        {/* Routes Setup */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={localStorage.getItem('token') ? <Dashboard /> : <Login />} />
          <Route path="/learn/:courseId" element={localStorage.getItem('token') ? <CoursePlayer /> : <Login />} />
          <Route path="/admin" element={localStorage.getItem('token') ? <Admin /> : <Login />} />
          
        </Routes>

      </div>
    </Router>
  );
}

export default App;