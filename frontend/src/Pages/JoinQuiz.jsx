// JoinQuiz.jsx
// -----------------------------------------------------------------------------
// This page allows a user to join a quiz by entering either:
// 1) A direct quiz ID, or
// 2) A full quiz link containing the quiz ID.
//
// It safely extracts the ID and redirects the user to the Instructions page.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import CreateQuizForm from "../components/CreateQuizForm";
import GlobalLoader from "../components/GloblaLoader";

export default function JoinQuiz() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Sidebar toggles
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal state for creating quizzes (only for creators/admin)
  const [openForm, setOpenForm] = useState(false);

  // User input field — can be ID or full URL
  const [link, setLink] = useState("");

  // Input validation errors
  const [error, setError] = useState("");

  // -----------------------------------------------------------------------------
  // extractQuizId()
  // Attempts to extract a quiz ID from:
  // - a direct ID text
  // - a full URL containing "/some/path/<quizId>"
  //
  // This supports flexibility (copy/pasted URLs, shared links, etc.).
  // -----------------------------------------------------------------------------
  const extractQuizId = (value) => {
    if (!value) return null;

    const trimmed = value.trim();

    // Accept plain IDs: alphanumeric + hyphens + underscores
    if (/^[A-Za-z0-9-_]+$/.test(trimmed)) return trimmed;

    // Try to parse as full URL
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    } catch {
      // Fallback: treat the value as a generic string path
      const parts = trimmed.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    }
  };

  // -----------------------------------------------------------------------------
  // handleJoin()
  // Validates the user's input, extracts quiz ID, and navigates to instructions.
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

  // Show loader until user authentication state completes
  if (loading) return <GlobalLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">

      {/* Logged-in user header */}
      <HeaderUser username={user?.username} fullname={user?.fullname} />

      <main className="relative flex flex-grow">

        {/* Sidebar navigation */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        {/* Main content */}
        <section className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

            <h1 className="text-2xl font-bold mb-3 dark:text-white text-center">
              Join a Quiz
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Paste the quiz link or enter the quiz ID.
            </p>

            {/* Join Quiz Form */}
            <form onSubmit={handleJoin} className="space-y-5">

              {/* Input field for quiz link or ID */}
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste quiz link or quiz ID"
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Validation message */}
              {error && (
                <p className="text-red-600 text-sm text-center">
                  {error}
                </p>
              )}

              {/* Form actions */}
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

        {/* Quiz builder modal (optional for creators) */}
        {openForm && (
          <CreateQuizForm closeForm={() => setOpenForm(false)} />
        )}
      </main>
    </div>
  );
}
