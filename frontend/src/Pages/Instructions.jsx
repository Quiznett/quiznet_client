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

  const [quiz, setQuiz] = useState(null);
  const [notStarted, setNotStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);

  // Format countdown time
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/v1/quiz/${quizId}/info/`);
        const data = res.data;

        setQuiz(data);

        if (data.already_submitted) {
          setAlreadySubmitted(true);
          return;
        }

        if (data.ended) {
          setEnded(true);
          return;
        }

        // Quiz not started yet → prepare countdown
        if (!data.started) {
          setNotStarted(true);

          const startTime = new Date(data.initiates_on).getTime();
          const now = Date.now();
          const diff = startTime - now;

          if (diff > 0) {
            setTimeLeft(diff);
          } else {
            // Backend says not started but time is passed → allow start
            setNotStarted(false);
          }

          return;
        }

      } catch (err) {
        setStatusError("Invalid quiz link.",err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [quizId]);

  // Countdown effect
  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setNotStarted(false); // quiz is now started
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const startAttempt = async () => {
    if (notStarted) return alert("Quiz has not started yet!");
    if (ended) return alert("Quiz has ended.");

    try {
      await axios.get(`/api/v1/quiz/attempt/${quizId}/`);
      navigate(`/attempt/${quizId}`);
    } catch (err) {
      const detail = err.response?.data?.detail;

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

  if (alreadySubmitted) {
    navigate(`/result/${quizId}`);
    return null;
  }
if (loading) return <GlobalLoader />;
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        <section className="flex-grow p-6 overflow-auto flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">

            {loading && (
              <p className="text-center text-gray-500 dark:text-gray-300">
                Loading quiz information...
              </p>
            )}

            {statusError && (
              <h1 className="text-center text-red-600 dark:text-red-400">
                {statusError}
              </h1>
            )}

            {quiz && (
              <>
                <h1 className="text-3xl font-extrabold mb-6 text-center dark:text-white">
                  {quiz.quiz_title}
                </h1>

                <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl mb-8 shadow-inner text-gray-800 dark:text-gray-200">
                  <p className="text-lg"><strong>Total Questions:</strong> {quiz.total_questions}</p>
                  <p className="text-lg"><strong>Duration:</strong> {quiz.duration_minutes} minutes</p>
                  <p className="text-lg"><strong>Starts:</strong> {new Date(quiz.initiates_on).toLocaleString()}</p>
                  <p className="text-lg"><strong>Ends:</strong> {new Date(quiz.ends_on).toLocaleString()}</p>
                </div>

                {/* NOT STARTED UI */}
                {notStarted && (
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                      ⏳ Quiz Has Not Started Yet
                    </h2>

                    {timeLeft !== null && (
                      <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Starting in <span className="font-bold">{formatTime(timeLeft)}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* ENDED UI */}
                {ended && (
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 text-center mb-8">
                    ⏱️ Quiz Has Ended
                  </h2>
                )}

                {/* INSTRUCTIONS (ONLY WHEN ACTIVE) */}
                {!notStarted && !ended && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">
                      Please read the instructions carefully:
                    </h2>
                    <ul className="list-disc pl-6 mb-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      <li>Timer starts when you click Start Attempt.</li>
                      <li>You cannot pause the timer.</li>
                      <li>Auto-submission when time runs out.</li>
                      <li>Do NOT close the quiz tab.</li>
                      <li>Ensure proper internet connection.</li>
                    </ul>
                  </>
                )}

                {/* BUTTONS */}
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

        {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}

      </main>
    </div>
  );
}
