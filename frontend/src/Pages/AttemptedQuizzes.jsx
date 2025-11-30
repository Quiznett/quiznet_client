import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import ResponseSheet from "../components/ResponseSheet";
import CreateQuizForm from "../components/CreateQuizForm";
import { Loader2 } from "lucide-react";
import GlobalLoader from "../components/GloblaLoader";

export default function AttemptedQuizzes() {
  const { user } = useAuth(); // Current logged-in user info

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    // Fetch all quizzes the user has attempted (or created)
    const load = async () => {
      try {
        setLoading(true);

        // Get list of quizzes related to this user
        const quizRes = await axiosInstance.get(
          "/api/v1/quiz/quizzes/attempted/"
        );
        const quizzes = quizRes?.data || [];
        const results = [];

        for (const quiz of quizzes) {
          try {
            // Fetch the user’s response for each quiz
            const attemptRes = await axiosInstance.get(
              `/api/v1/quiz/quizzes/${quiz.quiz_id}/responses/`
            );
            const data = attemptRes?.data;

            // Creator case: backend returns array of attempts
            if (Array.isArray(data)) {
              const ownAttempt = data.find(
                (resp) => String(resp.user_id) === String(user?.id)
              );

              if (!ownAttempt) {
                results.push({
                  quiz,
                  attempt: null,
                  submitted: false,
                });
                continue;
              }

              results.push({
                quiz,
                attempt: ownAttempt,
                submitted: true,
              });
              continue;
            }

            // Normal user case: backend returns single attempt object
            results.push({ quiz, attempt: data, submitted: true });
          } catch (error) {
            // Handle quizzes with no submitted attempt
            const detail = error?.response?.data?.detail;

            if (detail === "Attempt not submitted yet") {
              results.push({ quiz, attempt: null, submitted: false });
            } else {
              // Any other backend failure is handled gracefully in UI
              results.push({
                quiz,
                attempt: null,
                submitted: false,
                message: detail || "No response available",
              });
            }
          }
        }

        setAttemptedQuizzes(results);
      } catch  {
        // No console logging in production — silently fail
        // Page still shows safe UI fallbacks
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  // Show global loader during first-time load
  if (loading) return <GlobalLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top header with user info */}
      <HeaderUser username={user?.username} fullname={user?.fullname} />

      <main className="relative flex flex-grow">
        {/* App sidebar navigation */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        <section className="flex-grow p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Attempted Quizzes
          </h1>

          {/* Local content loader */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : attemptedQuizzes.length === 0 ? (
            // If user has not attempted any quiz yet
            <p className="text-gray-500 dark:text-gray-300">
              You haven’t attempted any quizzes yet.
            </p>
          ) : (
            // Render list of quizzes and attempt status
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attemptedQuizzes.map(({ quiz, attempt, submitted }) => (
                <div
                  key={quiz.quiz_id}
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow"
                >
                  <h2 className="text-xl font-semibold dark:text-white">
                    {quiz.quiz_title}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-300 mt-1">
                    Held on:{" "}
                    {quiz?.ends_on
                      ? new Date(quiz.ends_on).toLocaleString()
                      : "N/A"}
                  </p>

                  {submitted ? (
                    // User has submitted attempt
                    <button
                      onClick={() => setSelectedAttempt({ quiz, attempt })}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      View Response Sheet →
                    </button>
                  ) : (
                    // User did not submit
                    <button
                      disabled
                      className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                    >
                      Not Submitted
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Attempt response modal */}
      {selectedAttempt && (
        <ResponseSheet
          attempt={selectedAttempt.attempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}

      {/* Create quiz modal */}
      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
    </div>
  );
}
