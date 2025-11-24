import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import CreateQuizForm from "../components/CreateQuizForm";

export default function ResultPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);   

  const { user } = useAuth();
  const [score, setScore] = useState(null);

  useEffect(() => {
    const sc = localStorage.getItem("quiz_score");
    if (!sc) {
      alert("No result found.");
      return navigate("/user");
    }
    setScore(sc);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openCreateForm={() => setOpenForm(true)}    
        />

        {/* Main Content */}
        <section className="flex-grow p-6 flex justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
              Quiz Result
            </h1>

            <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-xl text-center">
              <p className="text-5xl font-bold dark:text-white">{score}</p>
              <p className="text-gray-600 dark:text-gray-300">Your Score</p>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/user")}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
              >
                Back to Dashboard
              </button>
            </div>

          </div>
        </section>

        
        {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}

      </main>
    </div>
  );
}
