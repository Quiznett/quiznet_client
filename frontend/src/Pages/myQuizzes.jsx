import { useState, useEffect } from "react";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import QuizCard from "../components/QuizCard";
import CreateQuizForm from "../components/CreateQuizForm";  // ⭐ Required
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

export default function MyQuizzes() {
  const { user, loading: authLoading } = useAuth();
  const [openForm, setOpenForm] = useState(false);  // ⭐ Required

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/quiz/create/");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    fetchQuizzes();
  }, [authLoading, user]);

  if (authLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        openCreateForm={() => setOpenForm(true)}   // ⭐ Pass correct function
      />

      {/* Main Content */}
      <div className="flex-1">
        <HeaderUser username={user.username} fullname={user.fullname} />

        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            My Quizzes
          </h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-20">
              No quizzes created yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.quiz_id} quiz={quiz} fetchQuizzes={fetchQuizzes} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ⭐ Add the modal here */}
      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
    </div>
  );
}
