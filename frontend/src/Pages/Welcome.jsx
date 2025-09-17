import { useEffect, useState } from "react"; // useState = manage state, useEffect = run code on mount/update
import { useNavigate } from "react-router-dom"; // useNavigate = navigate programmatically
import {
  Moon, Sun, Menu, Home, PlusSquare, LogIn,
  BarChart2, Trophy, Book, LogOut, Bell
} from "lucide-react"; // Import icons from lucide-react library
import Footer from "../components/Footer"; // Footer component for page bottom

export default function Welcome() {
  const navigate = useNavigate(); // Hook to redirect user to different pages
  const [username, setUsername] = useState(""); // State to store logged-in user's name
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to manage sidebar expand/collapse

  // Persistent dark mode state stored in localStorage
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  // Effect to apply dark mode whenever darkMode state changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode); // Add/remove 'dark' class to html element
    localStorage.setItem("darkMode", darkMode); // Save current dark mode preference
  }, [darkMode]);

  // Effect to check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get JWT token from localStorage
    const user = localStorage.getItem("username"); // Get username from localStorage

    if (!token || !user) {
      navigate("/login"); // If not logged in, redirect to login page
    } else {
      setUsername(user); // Set username state for greeting and avatar
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear all saved localStorage data (token, username)
    navigate("/login"); // Redirect user to login page
  };

  // Function to get initials from username for avatar display
  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U"; 
    // Split full name, take first letter of each part, join, uppercase. Default "U"

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Main container with dark/light background and smooth color transition */}

      {/* Top bar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center space-x-40">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Quiznet</h1>
          {/* App title with different color in dark mode */}
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            Welcome, {username || "Guest"} {/* Show username if available, otherwise Guest */}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notification bell */}
          <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition">
            <Bell className="w-5 h-5 text-gray-800 dark:text-gray-200" /> {/* Bell icon */}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)} // Toggle darkMode state
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
            {/* Show Sun icon if dark mode ON, Moon if OFF */}
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex flex-grow">
        {/* Sidebar */}
        <aside className={`transition-all duration-300 bg-white dark:bg-gray-800 shadow-md ${sidebarOpen ? "w-64" : "w-16"} flex flex-col justify-between`}>
          {/* Sidebar width changes based on sidebarOpen state */}
          <div>
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)} // Expand/collapse sidebar
              className="p-2 m-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center"
            >
              <Menu className="w-6 h-6" /> {/* Hamburger menu icon */}
            </button>

            {/* Sidebar navigation links (only show when expanded) */}
            {sidebarOpen && (
              <nav className="mt-4 flex flex-col gap-4 p-2 text-gray-700 dark:text-gray-200">
                <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer"><Home size={18}/> Dashboard</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer" onClick={() => navigate("/create-quiz")}><PlusSquare size={18}/> Create Quiz</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer" onClick={() => navigate("/join-quiz")}><LogIn size={18}/> Join Quiz</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer"><BarChart2 size={18}/> Performance</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer"><Trophy size={18}/> Leaderboard</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer"><Book size={18}/> Quiz Library</div>

                {/* Logout link */}
                <div onClick={handleLogout} className="flex items-center gap-2 hover:text-red-600 cursor-pointer mt-4 text-red-500">
                  <LogOut size={18}/> Logout
                </div>
              </nav>
            )}
          </div>

          {/* Profile section at bottom of sidebar */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg shadow-md">
              {getInitials(username)} {/* Show avatar initials */}
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-800 dark:text-gray-200">{username || "Guest"}</span>}
            {/* Show username next to avatar if sidebar is open */}
          </div>
        </aside>

        {/* Main content section */}
        <section className="flex-grow p-8 overflow-y-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="p-4 bg-blue-500 text-white rounded-xl shadow-md">
              Quizzes Taken<br/><span className="text-2xl font-bold">24</span>
            </div>
            <div className="p-4 bg-green-500 text-white rounded-xl shadow-md">
              Average Score<br/><span className="text-2xl font-bold">87%</span>
            </div>
            <div className="p-4 bg-purple-500 text-white rounded-xl shadow-md">
              Rank<br/><span className="text-2xl font-bold">#12</span>
            </div>
            <div className="p-4 bg-orange-500 text-white rounded-xl shadow-md">
              Streak<br/><span className="text-2xl font-bold">7 days</span>
            </div>
          </div>

          {/* Create / Join quiz cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div onClick={() => navigate("/create-quiz")} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg cursor-pointer text-center">
              <h2 className="text-xl font-bold mb-2">Create New Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Design engaging quizzes and challenge friends
              </p>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Get Started</button>
            </div>

            <div onClick={() => navigate("/join-quiz")} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg cursor-pointer text-center">
              <h2 className="text-xl font-bold mb-2">Join Live Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter a code and compete worldwide
              </p>
              <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg">Join Now</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer /> {/* Reusable footer component */}
    </div>
  );
}
