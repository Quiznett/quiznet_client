import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import HeaderUser from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import CreateQuizForm from "../components/CreateQuizForm";

export default function QuizAttempterList() {
  const { quizId } = useParams();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attempts, setAttempts] = useState([]);
   const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/api/v1/quiz/quizzes/${quizId}/responses/`)
      .then((res) => {
        setAttempts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => alert("Failed to load attempts"))
      .finally(() => setLoading(false));
  }, [quizId]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
               sidebarOpen={sidebarOpen}
               setSidebarOpen={setSidebarOpen}
               openCreateForm={() => setOpenForm(true)}
             />

     

      <div className="flex-1">
        <HeaderUser username={user.username} fullname={user.fullname} />

        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold dark:text-white mb-6">
            Participants
          </h1>

          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : attempts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No one has attempted this quiz yet.
            </p>
          ) : (
            attempts.map((a) => (
              <div
                key={a.user_id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-3 flex justify-between items-center"
              >
                <span className="text-lg font-medium dark:text-white">
                  {a.full_name} ({a.username})
                </span>

                <Link
                  to={`/quiz/${quizId}/attempter/${a.user_id}`}
                  state={{ attempt: a }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Response
                </Link>
              </div>
            ))
          )}
          
        </div>
        
      </div>
    {openForm && <CreateQuizForm closeForm={() => setOpenForm(false)} />}

    </div>
    
  );
}
