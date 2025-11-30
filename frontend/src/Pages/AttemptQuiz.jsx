// -----------------------------------------------------------------------------
// File: AttemptQuiz.jsx
// Purpose:
//   - Allows a user to attempt a quiz question-by-question.
//   - Loads quiz data, saved responses, and server-synced timer.
//   - Saves answers instantly (auto-save) as the user clicks options.
//   - Auto-submits when time ends or quiz is force-ended.
//   - Provides navigation between questions and manual final submission.
// -----------------------------------------------------------------------------



import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";
import TimerBar from "../components/TimerBar";
import QuizSidePanel from "../components/QuizSidePanel";
import axios from "../api/axios";
import GlobalLoader from "../components/GloblaLoader";
import { saveAnswer, getQuizStatus } from "../api/attempt";

export default function Attempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);          // Loaded quiz object with questions
  const [responses, setResponses] = useState({});  // Local answer state
  const [currentIndex, setCurrentIndex] = useState(0); // Current question index
  const [timer, setTimer] = useState(null);        // Server-synced timer info
  const [loading, setLoading] = useState(true);     // Initial page loader

  const isSubmitting = useRef(false);              // Prevent duplicate submits / race conditions

  const SUBMIT_URL = `/api/v1/quiz/attempt/${quizId}/submit/`;

  // =====================================================
  // 1. Load quiz attempt (questions + any saved answers)
  // =====================================================
  useEffect(() => {
    // Initial quiz load from backend
    axios
      .get(`/api/v1/quiz/attempt/${quizId}/`)
      .then((res) => {
        setQuiz(res.data);
        setResponses(res.data.responses || {}); // Load saved answers if user resumed
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  // =====================================================
  // 2. Setup timer using server time — prevents cheating
  // =====================================================
  useEffect(() => {
    if (!quiz) return;

    const loadTimer = async () => {
      try {
        const status = await getQuizStatus(quizId);

        // If user has already submitted, redirect them immediately
        if (status.already_submitted) {
          navigate(`/result/${quizId}`);
          return;
        }

        // If quiz ended or inactive → auto-submit for safety
        if (!status.is_active || status.quiz_ended) {
          autoSubmit("quiz ended (status API)");
          return;
        }

        // Calculate safe remaining time using server timestamps
        const startedAt = new Date(quiz.started_at).getTime();
        const timeLimitMs = quiz.time_limit_minutes * 60 * 1000;
        const quizEnd = new Date(quiz.ends_on).getTime();
        const nowServer = new Date(status.now).getTime();

        const attemptEnd = startedAt + timeLimitMs;
        const finalEnd = Math.min(attemptEnd, quizEnd);
        const remaining = Math.floor((finalEnd - nowServer) / 1000);

        if (remaining <= 0) {
          autoSubmit("time over on load");
          return;
        }

        // Store both endTime + remaining seconds for UI timer
        setTimer({
          endTime: finalEnd,
          remaining,
        });
      } catch {
        // Silent fail — if timer API fails, countdown fallback will still run
      }
    };

    loadTimer();
  }, [quiz]);

  // =====================================================
  // 3. Client-side countdown — trusted because it syncs
  //    to server endTime so local clock can't cheat.
  // =====================================================
  useEffect(() => {
    if (!timer?.endTime) return;

    const interval = setInterval(() => {
      const diff = Math.floor((timer.endTime - Date.now()) / 1000);

      // When timer ends → trigger auto submit
      if (diff <= 0) {
        clearInterval(interval);
        autoSubmit("timer ended");
        return;
      }

      setTimer((prev) => ({ ...prev, remaining: diff }));
    }, 500); // ~500ms keeps UI smooth

    return () => clearInterval(interval);
  }, [timer?.endTime]);

  // =====================================================
  // 4. Backend polling — catches cases where quiz ends
  //    early (admin force-stop, scheduled end, etc.)
  // =====================================================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await getQuizStatus(quizId);

        // If quiz ended mid-attempt
        if (status.quiz_ended && !isSubmitting.current) {
          autoSubmit("backend says quiz ended");
          return;
        }

        // If user submitted from another device/tab
        if (status.already_submitted) {
          navigate(`/result/${quizId}`);
          return;
        }
      } catch {
        // Poll errors ignored — user shouldn't see it
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [quizId]);

  // =====================================================
  // 5. Auto submit — used by timer & polling triggers
  // =====================================================
  const autoSubmit = async () => {
    // Prevent duplicate submissions
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      // Submit attempt without answers body → backend uses saved responses
      await axios.post(SUBMIT_URL);
    } catch {
      // Even if submission fails, still redirect → backend will handle inconsistencies
    }

    navigate(`/result/${quizId}`);
  };

  // =====================================================
  // 6. Manual submit — user clicks submit button
  // =====================================================
  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      await axios.post(SUBMIT_URL);
    } catch {
      // Submission errors are rare — user still redirected
    }

    navigate(`/result/${quizId}`);
  };

  // =====================================================
  // 7. Save answers — saved instantly for safety
  // =====================================================
  const handleSave = async (questionId, answerNumber) => {
    try {
      // Saves answer on backend (debounced by user clicks)
      await saveAnswer(quizId, questionId, answerNumber);

      // Immediately update UI
      setResponses((prev) => ({
        ...prev,
        [questionId]: answerNumber,
      }));
    } catch {
      // Errors hidden so user flow isn't interrupted
    }
  };

  // =====================================================
  // UI Rendering
  // =====================================================
  if (loading) return <GlobalLoader />; // Initial loader while quiz loads

  const q = quiz.questions[currentIndex]; // Active question

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top user header */}
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">
        {/* Sidebar with question numbers */}
        <QuizSidePanel
          questions={quiz.questions}
          responses={responses}
          currentIndex={currentIndex}
          jumpTo={(i) => setCurrentIndex(i)}
        />

        <section className="flex-grow p-6 overflow-auto flex justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

            {/* Timer display and progress bar */}
            {timer && timer.remaining > 0 && (
              <>
                <TimerBar
                  current={timer.remaining}
                  total={quiz.time_limit_minutes * 60}
                />

                <div className="text-right text-red-600 font-semibold mb-3">
                  ⏳ {Math.floor(timer.remaining / 60)}:
                  {String(timer.remaining % 60).padStart(2, "0")}
                </div>
              </>
            )}

            {/* Question text */}
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Q{currentIndex + 1}. {q.question_title}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                const num = i + 1;
                const selected = responses[q.question_id] === num;

                return (
                  <label
                    key={i}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer
                      ${
                        selected
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    onClick={() => handleSave(q.question_id, num)}
                  >
                    {/* Custom radio bullet */}
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          selected
                            ? "border-blue-600"
                            : "border-gray-400 dark:border-gray-600"
                        }`}
                    >
                      {selected && (
                        <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                      )}
                    </span>

                    <span className="ml-3 dark:text-gray-200">{opt}</span>
                  </label>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
              >
                Previous
              </button>

              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                disabled={currentIndex === quiz.questions.length - 1}
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                Next
              </button>
            </div>

            {/* Final submit */}
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Submit Quiz
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
