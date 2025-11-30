import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ResponseSheet from "../components/ResponseSheet";
import CreateQuizForm from "../components/CreateQuizForm";
import GlobalLoader from "../components/GloblaLoader";


export default function QuizSubmissions() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openQuizId, setOpenQuizId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [attempts, setAttempts] = useState({});
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const quizRes = await axiosInstance.get("/api/v1/quiz/create/");
        const now = new Date();
        const ended = quizRes.data.filter((quiz) => new Date(quiz.ends_on) <= now);
        setQuizzes(ended);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleQuiz = async (quizId) => {
    if (openQuizId === quizId) return setOpenQuizId(null);

    setOpenQuizId(quizId);

    if (attempts[quizId]) return;

    try {
      const res = await axiosInstance.get(`/api/v1/quiz/quizzes/${quizId}/responses/`);
      setAttempts((p) => ({ ...p, [quizId]: res.data }));
    } catch (err) {
      if (err.response?.status === 404) {
        setAttempts((p) => ({ ...p, [quizId]: [] }));
      }
    }
  };

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
            Quiz Responses
          </h1>

          {quizzes.length === 0 ? (
            <p className="text-gray-400">No quizzes with attempts yet.</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.quiz_id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
                >
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

                  {openQuizId === quiz.quiz_id && (
                    <div className="mt-4 border-t pt-3">
                      {attempts[quiz.quiz_id] === undefined ? (
                        <p className="text-gray-500">Loading attempts...</p>
                      ) : attempts[quiz.quiz_id].length === 0 ? (
                        <p className="text-gray-500">No one attempted this quiz.</p>
                      ) : (
                        attempts[quiz.quiz_id].map((a) => (
                          <button
                            key={a.user_id}
                            onClick={() => setSelectedAttempt(a)}
                            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 
                              dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex justify-between mt-2"
                          >
                            <span className="font-medium dark:text-white">
                              {a.full_name} ({a.username})
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

    {selectedAttempt && (
  <ResponseSheet
    attempt={selectedAttempt}
    onClose={() => setSelectedAttempt(null)}
  />
  
)}
{/* Create Quiz Form Modal */}
      {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}

    </div>
  );
}
