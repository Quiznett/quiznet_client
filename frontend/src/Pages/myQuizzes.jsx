// MyQuizzes.jsx
// -----------------------------------------------------------------------------
// This page displays all quizzes created by the logged-in user.
// It fetches quiz data from the backend, shows loading states, and allows the
// user to open the "Create Quiz" form.
// -----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import QuizCard from "../components/QuizCard";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import CreateQuizForm from "../components/CreateQuizForm";
import GlobalLoader from "../components/GloblaLoader";

export default function MyQuizzes() {
  const { user, loading: authLoading } = useAuth();

  // Stores list of quizzes created by the user
  const [quizzes, setQuizzes] = useState([]);

  // Loading state for quiz fetch
  const [loading, setLoading] = useState(true);

  // Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Create Quiz form modal visibility
  const [openForm, setOpenForm] = useState(false);

  // -----------------------------------------------------------------------------
  // Fetch quizzes created by the logged-in user
  // -----------------------------------------------------------------------------
  const fetchQuizzes = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/quiz/create/");
      setQuizzes(res.data);

    } catch (err) {
      // In production, log minimal info
      console.error("Error fetching quizzes"); // Removed stack traces

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------------
  // Fetch quizzes once user is authenticated and auth loading is complete
  // -----------------------------------------------------------------------------
  useEffect(() => {
    if (authLoading || !user) return;
    fetchQuizzes();
  }, [authLoading, user]);

  // Show loader while auth state is being checked
  if (authLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  // Block access if user is not logged in
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in...</p>
      </div>
    );

  // Full-screen loader while fetching quizzes
  if (loading) return <GlobalLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Top user info header */}
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        {/* Sidebar component */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        {/* Main Content Area */}
        <section className="flex-grow p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            My Quizzes
          </h1>

          {/* Conditional rendering based on quiz data */}
          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-20">
              No quizzes created yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.quiz_id}
                  quiz={quiz}
                  fetchQuizzes={fetchQuizzes} // Allows QuizCard to refresh the list after edit/delete
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create Quiz Form Modal */}
      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
    </div>
  );
}
