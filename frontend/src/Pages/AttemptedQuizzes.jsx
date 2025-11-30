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
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(false); // ⬅ FIXED (was true)
  const [openForm, setOpenForm] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const quizRes = await axiosInstance.get(
          "/api/v1/quiz/quizzes/attempted/"
        );
        const quizzes = quizRes.data;

        const results = [];

        for (const quiz of quizzes) {
          try {
            const attemptRes = await axiosInstance.get(
              `/api/v1/quiz/quizzes/${quiz.quiz_id}/responses/`
            );

            let data = attemptRes.data;

            // CREATOR CASE → backend returns array
            if (Array.isArray(data)) {
              const ownAttempt = data.find(
                (resp) => String(resp.user_id) === String(user.id)
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

            // NORMAL USER CASE → backend returns single object
            results.push({ quiz, attempt: data, submitted: true });
          } catch (error) {
            const detail = error.response?.data?.detail;

            if (detail === "Attempt not submitted yet") {
              results.push({ quiz, attempt: null, submitted: false });
            } else {
              results.push({
                quiz,
                attempt: null,
                submitted: false,
                message: detail || "No response",
              });
            }
          }
        }

        setAttemptedQuizzes(results);
      } catch (err) {
        console.error("Error loading attempted quizzes:", err);
      } finally {
        setLoading(false); // ⬅ End loader
      }
    };

    load();
  }, []);
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

        <section className="flex-grow p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Attempted Quizzes
          </h1>

          {/* ⬇ Loader INSIDE content area */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : attemptedQuizzes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">
              You haven’t attempted any quizzes yet.
            </p>
          ) : (
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
                    Held on: {new Date(quiz.ends_on).toLocaleString()}
                  </p>

                  {submitted ? (
                    <button
                      onClick={() => setSelectedAttempt({ quiz, attempt })}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      View Response Sheet →
                    </button>
                  ) : (
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

      {selectedAttempt && (
        <ResponseSheet
          attempt={selectedAttempt.attempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}

      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
    </div>
  );
}
