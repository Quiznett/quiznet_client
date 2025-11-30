// JoinQuiz.jsx
// -----------------------------------------------------------------------------
// This page allows a user to join a quiz by entering a quiz link or quiz ID.
// It extracts the quiz ID from either a direct ID or a full URL and redirects
// the user to the quiz instructions page.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import CreateQuizForm from "../components/CreateQuizForm";
import GlobalLoader from "../components/GloblaLoader";   // FIXED missing import

export default function JoinQuiz() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Create quiz modal state
  const [openForm, setOpenForm] = useState(false);

  // Input field state for quiz ID or link
  const [link, setLink] = useState("");

  // Error message state
  const [error, setError] = useState("");

  // -----------------------------------------------------------------------------
  // Extract quiz ID from:
  // 1) Direct ID (e.g., "abc123")
  // 2) A full quiz link (e.g., "http://site.com/quiz/abc123")
  // -----------------------------------------------------------------------------
  const extractQuizId = (value) => {
    if (!value) return null;

    const trimmed = value.trim();

    // If the value is already a valid ID (alphanumeric, hyphens, underscores)
    if (/^[A-Za-z0-9-_]+$/.test(trimmed)) return trimmed;

    // Try to extract from a valid URL
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    } catch {
      // Fallback: try splitting as a string even if not a valid URL
      const parts = trimmed.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    }
  };

  // -----------------------------------------------------------------------------
  // Handle form submission:
  // Extract the quiz ID → Validate → Redirect to instructions
  // -----------------------------------------------------------------------------
  const handleJoin = (e) => {
    e.preventDefault();
    setError("");

    const quizId = extractQuizId(link);

    if (!quizId) {
      setError("Invalid link. Could not extract quiz ID.");
      return;
    }

    navigate(`/instructions/${quizId}`);
  };

  // Show loading screen while user auth state is initializing
  if (loading) return <GlobalLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">

      {/* Top user header */}
      <HeaderUser username={user?.username} fullname={user?.fullname} />

      <main className="relative flex flex-grow">

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        {/* Main Content */}
        <section className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

            <h1 className="text-2xl font-bold mb-3 dark:text-white text-center">
              Join a Quiz
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Paste the quiz link or enter the quiz ID.
            </p>

            {/* Join Form */}
            <form onSubmit={handleJoin} className="space-y-5">

              {/* Input field */}
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste quiz link or quiz ID"
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Error message */}
              {error && (
                <p className="text-red-600 text-sm text-center">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow"
                >
                  Join Now
                </button>

                <button
                  type="button"
                  onClick={() => setLink("")}
                  className="px-6 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-200"
                >
                  Clear
                </button>
              </div>

            </form>
          </div>
        </section>

        {/* Create Quiz Form Modal */}
        {openForm && (
          <CreateQuizForm closeForm={() => setOpenForm(false)} />
        )}
      </main>
    </div>
  );
}
