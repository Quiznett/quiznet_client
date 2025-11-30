
// -----------------------------------------------------------------------------
// File: Result.jsx
// Purpose:
//   - Displays the final evaluated quiz result for the logged-in user.
//   - Fetches the user's attempt data (supports both creator and participant logic).
//   - Shows total score, correct/wrong/unanswered breakdown, and summary stats.
//   - Provides an option to open a detailed answer sheet in a modal.
//   - Includes sidebar navigation and create-quiz modal support.
// -----------------------------------------------------------------------------


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import CreateQuizForm from "../components/CreateQuizForm";
import axiosInstance from "../api/axios";
import ResponseSheet from "../components/ResponseSheet";
import GlobalLoader from "../components/GloblaLoader";

export default function ResultPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // Sidebar + modal state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { user, loading } = useAuth();

  // Final evaluated quiz result for this user
  const [result, setResult] = useState(null);

  // ---------------------------------------------------------------------------
  // Fetch the result of the quiz for the logged-in user.
  // Handles both creator (list of attempts) and participant (single object).
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Ensure auth state is finalized before running
    if (loading || !user) return;

    async function fetchResult() {
      try {
        const response = await axiosInstance.get(
          `/api/v1/quiz/quizzes/${quizId}/responses/`
        );

        const data = response.data;
        let resultForUser = null;

        // Case: Creator → response is array, find this user's attempt
        if (Array.isArray(data)) {
          resultForUser = data.find(
            (a) => String(a.user_id) === String(user.id)
          );
        } else {
          // Normal user → backend returns single attempt object
          resultForUser = data;
        }

        // If somehow no result found → redirect back
        if (!resultForUser) {
          alert("No result found.");
          navigate("/user");
          return;
        }

        setResult(resultForUser);
      } catch {
        // Silent production logging
        alert("Could not fetch result.");
        navigate("/user");
      }
    }

    fetchResult();
  }, [quizId, user, loading, navigate]);

  // Unified loader (auth loading + result loading)
  if (loading || !user || !result) {
    return <GlobalLoader />;
  }

  // ---------------------------------------------------------------------------
  // Basic statistics
  // ---------------------------------------------------------------------------
  const total = result.responses.length;
  const correct = result.responses.filter((r) => r.is_correct).length;
  const wrong = result.responses.filter(
    (r) => !r.is_correct && r.selected_option !== null
  ).length;
  const left = result.responses.filter((r) => r.selected_option === null).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top bar with user info */}
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        {/* Sidebar navigation */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        {/* Main Result Content */}
        <section className="flex-grow p-6 overflow-auto flex justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
              Quiz Result
            </h1>

            {/* Final Score */}
            <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-xl text-center mb-8">
              <p className="text-5xl font-bold dark:text-white">{result.score}</p>
              <p className="text-gray-600 dark:text-gray-300">Your Score</p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-6 text-center mb-8">

              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-xl">
                <p className="text-xl font-bold dark:text-white">{correct}</p>
                <p>Correct</p>
              </div>

              <div className="p-4 bg-red-100 dark:bg-red-900 rounded-xl">
                <p className="text-xl font-bold dark:text-white">{wrong}</p>
                <p>Wrong</p>
              </div>

              <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                <p className="text-xl font-bold dark:text-white">{left}</p>
                <p>Unanswered</p>
              </div>

              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl">
                <p className="text-xl font-bold dark:text-white">{total}</p>
                <p>Total Questions</p>
              </div>

            </div>

            {/* View Answer Sheet */}
            <div className="text-center">
              <button
                onClick={() => setOpenModal(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
              >
                View Answer Sheet
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/user")}
                className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow"
              >
                Back to Dashboard
              </button>
            </div>

          </div>
        </section>

        {/* Create Quiz Form (modal) */}
        {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}

        {/* Detailed Answer Sheet Modal */}
        {openModal && (
          <ResponseSheet
            attempt={result}
            onClose={() => setOpenModal(false)}
          />
        )}
      </main>
    </div>
  );
}
