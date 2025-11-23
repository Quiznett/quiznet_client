// src/Pages/JoinQuiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../api/axios";

import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function JoinQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  // Extract quiz id (your exact logic)
  const extractQuizId = (value) => {
    if (!value) return null;
    const trimmed = value.trim();

    if (/^[A-Za-z0-9-_]+$/.test(trimmed)) return trimmed;

    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    } catch (e) {}

    const parts = trimmed.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  };
const handleJoin = async (e) => {
  e.preventDefault();
  setError("");

  const quizId = extractQuizId(link);
  if (!quizId) {
    setError("Invalid link. Could not extract quiz ID.");
    return;
  }

  try {
    // 🔍 Check backend before navigating
    await axios.get(`/api/v1/quiz/attempt/${quizId}/`);

    navigate(`/instructions/${quizId}`);
  } catch (err) {
    const msg = err.response?.data?.detail || "Quiz not found.";
    setError(msg);
  }
};


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <HeaderUser username={user?.username} fullname={user?.fullname} />

      <main className="relative flex flex-grow">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Center content */}
        <section className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-3 dark:text-slate-200 text-center">
              Join a Quiz
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Paste the quiz link you received or enter the quiz ID directly.
            </p>

            <form onSubmit={handleJoin} className="space-y-5">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste quiz link or quiz ID"
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

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
      </main>
    </div>
  );
}
