import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import CreateQuizForm from "../components/CreateQuizForm";

export default function QuizAttempterList() {
  const { quizId } = useParams();
  const { user } = useAuth();

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stores all attempts for this quiz
  const [attempts, setAttempts] = useState([]);

  // Create quiz form modal
  const [openForm, setOpenForm] = useState(false);

  // Page-level load state
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // Fetch all attempts submitted for a specific quiz
  // ---------------------------------------------------------------------------
  useEffect(() => {
    axiosInstance
      .get(`/api/v1/quiz/quizzes/${quizId}/responses/`)
      .then((res) => {
        // Backend returns an array when owner fetches responses
        setAttempts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        // Minimal production-safe messaging
        alert("Failed to load attempts");
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

      {/* Sidebar navigation */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        openCreateForm={() => setOpenForm(true)}
      />

      <div className="flex-1">

        {/* Logged-in user header */}
        <HeaderUser username={user.username} fullname={user.fullname} />

        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold dark:text-white mb-6">
            Participants
          </h1>

          {/* Loading state */}
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : attempts.length === 0 ? (
            // No attempts available
            <p className="text-gray-600 dark:text-gray-400">
              No one has attempted this quiz yet.
            </p>
          ) : (
            // Render each participant with option to view their response
            attempts.map((attempt) => (
              <div
                key={attempt.user_id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-3 flex justify-between items-center"
              >
                <span className="text-lg font-medium dark:text-white">
                  {attempt.full_name} ({attempt.username})
                </span>

                <Link
                  to={`/quiz/${quizId}/attempter/${attempt.user_id}`}
                  state={{ attempt }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Response
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create quiz modal */}
      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
    </div>
  );
}
