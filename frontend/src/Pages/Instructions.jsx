// src/Pages/Instructions.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CreateQuizForm from "../components/CreateQuizForm";

export default function Instructions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);   

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    axios
      .get(`/api/v1/quiz/attempt/${quizId}/`)
      .then((res) => {
        if (!mounted) return;
        setQuiz(res.data);
      })
      .catch(async (err) => {
        const detail = err.response?.data?.detail;
        const status = err.response?.status;

        console.log("ATTEMPT ERROR:", detail, "STATUS:", status);

        if (detail === "You have already submitted this quiz.") {
          try {
            const sub = await axios.post(`/api/v1/quiz/attempt/${quizId}/submit/`);
            if (sub.data.score !== undefined) {
              localStorage.setItem("quiz_score", sub.data.score);
            }
          } catch (e) {}
          return navigate(`/result/${quizId}`);
        }

        if (
          detail === "Quiz has ended." ||
          detail === "Quiz is not active." ||
          status === 404
        ) {
          setQuizEnded(true);
          return;
        }

        setError("Couldn't load quiz info. Make sure the link is valid.");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [quizId, navigate]);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-gray-200">
        Loading quiz information...
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderUser username={user.username} fullname={user.fullname} />

        <div className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10 text-center">
            <h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">
              ⏱️ Quiz Has Ended
            </h1>

            <p className="text-lg dark:text-gray-300 mb-6">This quiz is no longer available.</p>

            <button
              onClick={() => navigate("/user")}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:bg-gray-900">
        {error}
      </div>
    );
  }



  const title = quiz?.quiz_title || "Quiz";
  const questionsCount = quiz?.questions?.length || 0;
  const duration = quiz?.time_limit_minutes ?? 0;

  const now = new Date();
  const startTime = new Date(quiz?.initiates_on);
  const quizNotStarted = now < startTime;

  const startAttempt = () => navigate(`/attempt/${quizId}`);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}     
        />

        <section className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">

            <h1 className="text-3xl font-extrabold mb-6 text-center dark:text-white">
              {title}
            </h1>

            {quizNotStarted && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-xl mb-6 text-center">
                <h2 className="text-xl font-bold mb-2">🚫 Quiz Not Started Yet</h2>
                <p>This quiz is scheduled to start at:</p>
                <p className="text-lg font-semibold mt-1">
                  {startTime.toLocaleString()}
                </p>
              </div>
            )}

            <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl mb-8 shadow-inner">
              <p className="text-lg"><strong>Total Questions:</strong> {questionsCount}</p>
              <p className="text-lg"><strong>Duration:</strong> {duration} minutes</p>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h2 className="text-xl font-semibold dark:text-white">
                Please read the instructions carefully:
              </h2>

              <ul className="list-disc pl-6 space-y-3 text-sm leading-relaxed">
                <li>Timer starts when you click Start Attempt.</li>
                <li>The timer cannot be paused.</li>
                <li>Quiz auto-submits when time ends.</li>
                <li>Do NOT refresh or close the browser.</li>
                <li>Ensure a stable internet connection.</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                onClick={startAttempt}
                disabled={quizNotStarted}
                className={`px-8 py-3 rounded-xl shadow-md text-lg
                  ${quizNotStarted
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                Start Attempt
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 border rounded-xl dark:border-gray-600 dark:text-gray-200 text-lg"
              >
                Back
              </button>
            </div>

          </div>
        </section>

        {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
      </main>
    </div>
  );
}
