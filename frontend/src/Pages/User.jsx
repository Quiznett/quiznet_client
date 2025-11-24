import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import CreateQuizForm from "../components/CreateQuizForm";

export default function User() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}
        />

        <section className="flex-grow p-8 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-blue-500 text-white rounded-xl shadow-md">
              Quizzes Taken <br />
              <span className="text-2xl font-bold">0</span>
            </div>
            <div className="p-4 bg-green-500 text-white rounded-xl shadow-md">
              Quizzes Created <br />
              <span className="text-2xl font-bold">0</span>
            </div>
            <div className="p-4 bg-purple-500 text-white rounded-xl shadow-md">
              Average Score <br />
              <span className="text-2xl font-bold">0</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div
              onClick={() => setOpenForm(true)}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg cursor-pointer text-center"
            >
              <h2 className="dark:text-slate-200 text-xl font-bold mb-2">Create New Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Design quizzes easily</p>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Get Started
              </button>
            </div>

            <div
              onClick={() => navigate("/join-quiz")}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg cursor-pointer text-center"
            >
              <h2 className="dark:text-slate-200 text-xl font-bold mb-2">Join Live Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Enter a code to join</p>
              <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg">
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
