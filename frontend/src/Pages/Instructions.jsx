// -----------------------------------------------------------------------------
// File: Instructions.jsx
// Purpose:
//   - Shows quiz instructions and status before a user starts attempting a quiz.
//   - Fetches quiz metadata (start time, end time, total questions, duration).
//   - Handles multiple states: not started, active, ended, or already submitted.
//   - Displays a countdown timer if the quiz hasn’t started yet.
//   - Redirects users who have already submitted to the result page.
//   - Allows user to begin the quiz after a final status validation.
// -----------------------------------------------------------------------------



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CreateQuizForm from "../components/CreateQuizForm";
import GlobalLoader from "../components/GloblaLoader";

export default function Instructions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState("");

  const [quiz, setQuiz] = useState(null);            // Quiz metadata from backend
  const [notStarted, setNotStarted] = useState(false); // Indicates quiz start time hasn't arrived
  const [ended, setEnded] = useState(false);           // Quiz already ended
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);     // Countdown time until quiz starts

  // Format milliseconds into mm:ss for countdown
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ======================================================
  // Load quiz info (status, timings, attempt state)
  // ======================================================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/v1/quiz/${quizId}/info/`);
        const data = res.data;

        setQuiz(data);

        // Redirect user immediately if they already attempted
        if (data.already_submitted) {
          setAlreadySubmitted(true);
          return;
        }

        if (data.ended) {
          setEnded(true);
          return;
        }

        // If backend says quiz not started, show countdown
        if (!data.started) {
          setNotStarted(true);

          const startTime = new Date(data.initiates_on).getTime();
          const now = Date.now();
          const diff = startTime - now;

          // If start time is still in future → show countdown
          if (diff > 0) {
            setTimeLeft(diff);
          } else {
            // Rare case: start time passed but backend still flags not started
            setNotStarted(false);
          }

          return;
        }
      } catch {
        // If quizId invalid or backend error
        setStatusError("Invalid quiz link.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [quizId]);

  // ======================================================
  // Countdown timer until quiz starts
  // ======================================================
  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // When countdown hits zero → allow quiz to start
        if (prev <= 1000) {
          clearInterval(interval);
          setNotStarted(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // ======================================================
  // Start Attempt Handler
  // Validates quiz status before moving user to attempt screen
  // ======================================================
  const startAttempt = async () => {
    if (notStarted) return alert("Quiz has not started yet!");
    if (ended) return alert("Quiz has ended.");

    try {
      // This GET call initializes attempt on backend
      await axios.get(`/api/v1/quiz/attempt/${quizId}/`);
      navigate(`/attempt/${quizId}`);
    } catch (err) {
      const detail = err.response?.data?.detail;

      // Backend-side validation messages
      if (detail === "Quiz has ended.") {
        setEnded(true);
        return;
      }

      if (detail === "You have already submitted this quiz.") {
        navigate(`/result/${quizId}`);
        return;
      }
    }
  };

  // Redirect if attempt already submitted
  if (alreadySubmitted) {
    navigate(`/result/${quizId}`);
    return null;
  }

  if (loading) return <GlobalLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* User info header */}
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        {/* Sidebar navigation */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        <section className="flex-grow p-6 overflow-auto flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">

            {/* Loading state for slow API */}
            {loading && (
              <p className="text-center text-gray-500 dark:text-gray-300">
                Loading quiz information...
              </p>
            )}

            {/* Invalid quiz / backend error */}
            {statusError && (
              <h1 className="text-center text-red-600 dark:text-red-400">
                {statusError}
              </h1>
            )}

            {/* MAIN CONTENT */}
            {quiz && (
              <>
                {/* Quiz title */}
                <h1 className="text-3xl font-extrabold mb-6 text-center dark:text-white">
                  {quiz.quiz_title}
                </h1>

                {/* Quiz details section */}
                <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl mb-8 shadow-inner text-gray-800 dark:text-gray-200">
                  <p className="text-lg"><strong>Total Questions:</strong> {quiz.total_questions}</p>
                  <p className="text-lg"><strong>Duration:</strong> {quiz.duration_minutes} minutes</p>
                  <p className="text-lg"><strong>Starts:</strong> {new Date(quiz.initiates_on).toLocaleString()}</p>
                  <p className="text-lg"><strong>Ends:</strong> {new Date(quiz.ends_on).toLocaleString()}</p>
                </div>

                {/* Before-start countdown */}
                {notStarted && (
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                      ⏳ Quiz Has Not Started Yet
                    </h2>

                    {timeLeft !== null && (
                      <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Starting in{" "}
                        <span className="font-bold">{formatTime(timeLeft)}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* After end message */}
                {ended && (
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 text-center mb-8">
                    ⏱️ Quiz Has Ended
                  </h2>
                )}

                {/* Instructions only appear when quiz is active */}
                {!notStarted && !ended && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">
                      Please read the instructions carefully:
                    </h2>

                    <ul className="list-disc pl-6 mb-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      <li>Timer starts when you click Start Attempt.</li>
                      <li>You cannot pause the timer.</li>
                      <li>Auto-submission will occur when time runs out.</li>
                      <li>Do NOT close or refresh the quiz tab.</li>
                      <li>Ensure you have a stable internet connection.</li>
                    </ul>
                  </>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4 pt-8">

                  {!ended && !notStarted && (
                    <button
                      onClick={startAttempt}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow"
                    >
                      Start Attempt
                    </button>
                  )}

                  <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 border rounded-xl dark:border-gray-600 dark:text-gray-200"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Create Quiz modal (creator tools) */}
        {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
      </main>
    </div>
  );
}
