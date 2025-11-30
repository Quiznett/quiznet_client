// myQuizzes.jsx
// -----------------------------------------------------------------------------
// This page displays all quizzes created by the logged-in user.
// It loads quiz data from the backend, shows loading states, and provides
// access to the "Create Quiz" modal for adding new quizzes.
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

  // Stores quizzes created by the user
  const [quizzes, setQuizzes] = useState([]);

  // Page-level loading state for quiz fetch
  const [loading, setLoading] = useState(true);

  // Sidebar open/close toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Create Quiz modal visibility
  const [openForm, setOpenForm] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch quizzes owned by the logged-in user
  // ---------------------------------------------------------------------------
  const fetchQuizzes = async () => {
    try {
      // Backend returns all quizzes created by the authenticated user
      const res = await axiosInstance.get("/api/v1/quiz/create/");
      setQuizzes(res.data);
    } catch {
      // In production: only minimal logging, no console stack trace
      console.error("Error fetching quizzes");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Load quizzes only after authentication state is resolved
  // Prevents fetching with undefined user state
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (authLoading || !user) return;
    fetchQuizzes();
  }, [authLoading, user]);

  // Authentication still initializing → show spinner
  if (authLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  // User not logged in (extra safety)
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in...</p>
      </div>
    );

  // Full-screen loader while quizzes are being fetched
  if (loading) return <GlobalLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header with user profile info */}
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        {/* App sidebar with navigation & create-quiz trigger */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        {/* Main content area */}
        <section className="flex-grow p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            My Quizzes
          </h1>

          {/* Show message when user has not created any quizzes */}
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
                  // Allow QuizCard to trigger a refresh after editing or deleting a quiz
                  fetchQuizzes={fetchQuizzes}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create Quiz Modal */}
      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
    </div>
  );
}
