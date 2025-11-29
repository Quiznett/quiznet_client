import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import CreateQuizForm from "../components/CreateQuizForm";
import axiosInstance from "../api/axios";

export default function User() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [createdCount, setCreatedCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Total quizzes CREATED
        const createdRes = await axiosInstance.get("/api/v1/quiz/create/");
        setCreatedCount(createdRes.data.length);

        // Total quizzes ATTEMPTED
        const attemptedRes = await axiosInstance.get(
          "/api/v1/quiz/quizzes/attempted/"
        );
        setAttemptedCount(attemptedRes.data.length);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      }
    };

    loadData();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in...</p>;

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
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-500 text-white rounded-xl shadow-md">
              <p className="text-lg font-semibold">Quizzes Attempted</p>
              <span className="text-4xl font-bold">{attemptedCount}</span>
            </div>

            <div className="p-6 bg-green-500 text-white rounded-xl shadow-md">
              <p className="text-lg font-semibold">Quizzes Created</p>
              <span className="text-4xl font-bold">{createdCount}</span>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Create Quiz */}
            <div
              onClick={() => setOpenForm(true)}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl cursor-pointer text-center transition"
            >
              <h2 className="dark:text-slate-200 text-xl font-bold mb-2">
                Create New Quiz
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Design quizzes easily
              </p>
              <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Get Started
              </button>
            </div>

            {/* Join Quiz */}
            <div
              onClick={() => navigate("/join-quiz")}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl cursor-pointer text-center transition"
            >
              <h2 className="dark:text-slate-200 text-xl font-bold mb-2">
                Join Live Quiz
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter a code to join
              </p>
              <button className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg">
                Join Now
              </button>
            </div>
          </div>

          {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}
        </section>
      </main>
    </div>
  );
}
