// src/Pages/Instructions.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Instructions() {
  const [backendMessage, setBackendMessage] = useState("");

  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    setLoading(true);
    setBackendMessage("");

    axios
      .get(`/api/v1/quiz/attempt/${quizId}/`)
      .then((res) => {
        setQuiz(res.data);
      })
      .catch((err) => {
        const message = err.response?.data?.detail || "Unable to load quiz.";
        setBackendMessage(message);
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderUser />
        <main className="flex items-center justify-center flex-grow text-gray-600 dark:text-gray-300">
          Loading quiz information...
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderUser />
        <main className="flex items-center justify-center flex-grow text-red-600">
          {error}
        </main>
      </div>
    );
  }

  // Extract clean fields
  const title = quiz?.quiz?.title || quiz?.title || "Quiz";
  const questionsCount =
    quiz?.questions?.length ?? quiz?.quiz?.question_count ?? "Unknown";
  const duration = quiz?.quiz?.duration ?? quiz?.duration ?? null;

  const startAttempt = () => navigate(`/attempt/${quizId}`);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <HeaderUser username={user?.username} fullname={user?.fullname} />

    {/* Inside return ... replace ONLY the section inside <main> */}

<main className="relative flex flex-grow">
  <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

  {/* If backend returned a message (quiz ended, not active, submitted) */}
  {backendMessage && (
    <section className="flex-grow flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        
        <p className="text-red-600 text-lg mb-4">{backendMessage}</p>

        {/* If quiz metadata exists, still show the title */}
        {quiz?.quiz?.title && (
          <h1 className="text-xl font-bold dark:text-slate-200 mb-2">
            {quiz.quiz.title}
          </h1>
        )}

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-200 mt-4"
        >
          Back
        </button>

      </div>
    </section>
  )}

  {/* If no blocking backend message → show full quiz details */}
  {!backendMessage && (
    <section className="flex-grow flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        
        <h1 className="text-2xl font-bold mb-3 dark:text-slate-200 text-center">
          {title}
        </h1>

        <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
          <div className="mb-1">Total Questions: {questionsCount}</div>
          {duration && <div className="mb-1">Total Time: {duration} minutes</div>}
          <p className="mt-4 text-sm">Once you start, the timer cannot be paused.</p>
          <p className="mt-1 text-sm text-red-500">
            The quiz will auto-submit when time ends.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={startAttempt}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          >
            Start Attempt
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-200"
          >
            Back
          </button>
        </div>
      </div>
    </section>
  )}
</main>

    </div>
  );
}
