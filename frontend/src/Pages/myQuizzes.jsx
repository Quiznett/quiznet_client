import { useState, useEffect } from "react";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import QuizCard from "../components/QuizCard";
import api from "../api/axios";
import { Loader2 } from "lucide-react";

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);


  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  
  useEffect(() => {
    const user = sessionStorage.getItem("username");
    const name = sessionStorage.getItem("fullname");
    const token = sessionStorage.getItem("access");

    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (user) {
      setUsername(user);
      setFullname(name || user);
    }

    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = sessionStorage.getItem("access");

      
      if (!token) {
        console.warn("Token missing. Skipping quiz fetch.");
        return;
      }

      const res = await api.get("http://127.0.0.1:8000/api/v1/quiz/create", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1">
        <HeaderUser
          username={username}
          fullname={fullname}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          getInitials={(name) =>
            name.split(" ").map((n) => n[0]).join("").toUpperCase()
          }
        />

        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            My Quizzes
          </h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No quizzes created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.quiz_id} quiz={quiz} fetchQuizzes={fetchQuizzes} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
