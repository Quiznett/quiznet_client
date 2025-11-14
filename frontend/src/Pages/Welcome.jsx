import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

export default function Welcome() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  // 🌙 Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Authentication
  useEffect(() => {
    const access = sessionStorage.getItem("access");
    const storedUser = sessionStorage.getItem("username");
    const storedFullname = sessionStorage.getItem("fullname");

    if (access && storedUser) {
      setUsername(storedUser);
      setFullname(storedFullname || "");
      return;
    }

    navigate("/login");
  }, [navigate]);

  const handleLogout = async () => {
    await api.post("logout/");
    sessionStorage.clear();
    navigate("/login");
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <HeaderUser
        username={username}
        fullname={fullname}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleLogout={handleLogout}
        getInitials={getInitials}
      />

      <main className="relative flex flex-grow">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <section className="flex-grow p-8 overflow-y-auto">
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="p-4 bg-blue-500 text-white rounded-xl shadow-md">
              Quizzes Taken
              <br />
              <span className="text-2xl font-bold">24</span>
            </div>
            <div className="p-4 bg-green-500 text-white rounded-xl shadow-md">
              Average Score
              <br />
              <span className="text-2xl font-bold">87%</span>
            </div>
            <div className="p-4 bg-purple-500 text-white rounded-xl shadow-md">
              Rank
              <br />
              <span className="text-2xl font-bold">#12</span>
            </div>
            <div className="p-4 bg-orange-500 text-white rounded-xl shadow-md">
              Streak
              <br />
              <span className="text-2xl font-bold">7 days</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            
            {/* Create Quiz */}
            <div
              onClick={() => navigate("/create-quiz-form")}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg cursor-pointer text-center"
            >
              <h2 className="dark:text-slate-200 text-xl font-bold mb-2">Create New Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Design engaging quizzes and challenge friends
              </p>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Get Started
              </button>
            </div>

            {/* Join Quiz */}
            <div
              onClick={() => navigate("/join-quiz")}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg cursor-pointer text-center"
            >
              <h2 className="dark:text-slate-200 text-xl font-bold mb-2">Join Live Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter a code and compete worldwide
              </p>
              <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg">
                Join Now
              </button>
            </div>

          </div>

        </section>
      </main>

      
    </div>
  );
}
