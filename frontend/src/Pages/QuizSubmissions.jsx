import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import ResponseSheet from "../components/ResponseSheet";
import CreateQuizForm from "../components/CreateQuizForm";
import GlobalLoader from "../components/GloblaLoader";

export default function QuizSubmissions() {
  const { user } = useAuth();

  // Sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // List of quizzes that already ended (creator’s quizzes)
  const [quizzes, setQuizzes] = useState([]);

  // Page-level loading state
  const [loading, setLoading] = useState(true);

  // Tracks which quiz is currently expanded
  const [openQuizId, setOpenQuizId] = useState(null);

  // Create Quiz modal toggle
  const [openForm, setOpenForm] = useState(false);

  // Stores attempts per quiz ID → { quizId: [attempts] }
  const [attempts, setAttempts] = useState({});

  // Selected attempt to open ResponseSheet modal
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  // -----------------------------------------------------------------------------
  // Fetch only quizzes that have already ended.
  // These are the ones that can have responses submitted.
  // -----------------------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const quizRes = await axiosInstance.get("/api/v1/quiz/create/");
        const now = new Date();

        // Only include quizzes whose end time has passed
        const endedQuizzes = quizRes.data.filter(
          (quiz) => new Date(quiz.ends_on) <= now
        );

        setQuizzes(endedQuizzes);
      } catch {
        // Minimal production logging
        console.error("Error fetching quizzes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // -----------------------------------------------------------------------------
  // Toggle open/close of quiz accordion.
  // On first open, fetch responses for that quiz.
  // -----------------------------------------------------------------------------
  const toggleQuiz = async (quizId) => {
    // Collapse if already open
    if (openQuizId === quizId) {
      setOpenQuizId(null);
      return;
    }

    setOpenQuizId(quizId);

    // If attempts already fetched, do not re-fetch
    if (attempts[quizId]) return;

    try {
      const res = await axiosInstance.get(
        `/api/v1/quiz/quizzes/${quizId}/responses/`
      );
      setAttempts((prev) => ({ ...prev, [quizId]: res.data }));
    } catch (err) {
      // If no attempts exist, backend may return 404 → treat as empty array
      if (err.response?.status === 404) {
        setAttempts((prev) => ({ ...prev, [quizId]: [] }));
      }
    }
  };

  // Global loader shown during initial quiz fetch
  if (loading) return <GlobalLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header with user info */}
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        {/* Sidebar navigation */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        {/* Main Content Area */}
        <section className="flex-grow p-8 overflow-auto">

          <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Quiz Responses
          </h1>

          {/* No ended quizzes */}
          {quizzes.length === 0 ? (
            <p className="text-gray-400">No quizzes with attempts yet.</p>
          ) : (
            <div className="space-y-4">

              {/* Each ended quiz collapsible card */}
              {quizzes.map((quiz) => (
                <div
                  key={quiz.quiz_id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
                >
                  {/* Accordion Header */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleQuiz(quiz.quiz_id)}
                  >
                    <div>
                      <h2 className="text-xl font-semibold dark:text-white">
                        {quiz.quiz_title}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        Ended on: {new Date(quiz.ends_on).toLocaleString()}
                      </p>
                    </div>

                    {openQuizId === quiz.quiz_id ? (
                      <ChevronUp size={28} className="text-indigo-600" />
                    ) : (
                      <ChevronDown size={28} className="text-indigo-600" />
                    )}
                  </div>

                  {/* Accordion Body */}
                  {openQuizId === quiz.quiz_id && (
                    <div className="mt-4 border-t pt-3">

                      {/* Loading attempts state */}
                      {attempts[quiz.quiz_id] === undefined ? (
                        <p className="text-gray-500">Loading attempts...</p>
                      ) : attempts[quiz.quiz_id].length === 0 ? (
                        /* No attempt submitted */
                        <p className="text-gray-500">
                          No one attempted this quiz.
                        </p>
                      ) : (
                        /* Attempt list */
                        attempts[quiz.quiz_id].map((attempt) => (
                          <button
                            key={attempt.user_id}
                            onClick={() => setSelectedAttempt(attempt)}
                            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex justify-between mt-2"
                          >
                            <span className="font-medium dark:text-white">
                              {attempt.full_name} ({attempt.username})
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              View →
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Attempt Viewer Modal */}
      {selectedAttempt && (
        <ResponseSheet
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}

      {/* Create Quiz Modal */}
      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
    </div>
  );
}
