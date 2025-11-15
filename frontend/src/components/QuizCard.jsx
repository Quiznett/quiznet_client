import { useState } from "react";
import api from "../api/axios";

export default function QuizCard({ quiz, fetchQuizzes, navigate }) {
  const [open, setOpen] = useState(false);

  function formatLocalDateTime(utcString)
  {
    const date = new Date(utcString);
    const localDate = date.toLocaleDateString([],
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
    const localTime = date.toLocaleTimeString([],{
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    
    return { localDate, localTime };
  }

  const totalQuestions = quiz.question_count || 0;
  const totalMarks = totalQuestions * quiz.marks_per_question;

  const { localDate: startDate, localTime: startTime } = formatLocalDateTime(quiz.initiates_on);
  const { localTime: endTime } = formatLocalDateTime(quiz.ends_on);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const token = sessionStorage.getItem("access");
      await api.delete(`http://127.0.0.1:8000/api/v1/quiz/delete/${quiz.quiz_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuizzes();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // const handlePublish = async () => {
  //   try {
  //     const token = sessionStorage.getItem("access");
  //     await api.patch(
  //       `http://127.0.0.1:8000/api/v1/quiz/publish/${quiz.quiz_id}/`,
  //       { is_active: !quiz.is_active },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     fetchQuizzes();
  //   } catch (err) {
  //     console.error("Publish error", err);
  //   }
  // };

  const handlePublish = () => {
    const baseUrl = import.meta.env.VITE_FRONTEND_URL;

    const link = `${baseUrl}/attempt/${quiz.quiz_id}`;

    navigator.clipboard.writeText(link);

    alert("Quiz link copied:\n" + link)
  };

  const handleEdit = () => {
    navigate(`/edit-quiz/${quiz.quiz_id}`, { state: quiz });
  };

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition border dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
          {quiz.quiz_title}
        </h2>
        <button
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setOpen(!open)}
        >
          Details
        </button>
      </div>

      {open && (
        <div className="mt-4 text-sm space-y-1 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <p><strong>Date:</strong> {startDate}</p>
          <p><strong>Time:</strong> {startTime} - {endTime}</p>
          <p><strong>Total Questions:</strong> {totalQuestions}</p>
          <p><strong>Total Marks:</strong> {totalMarks}</p>
          <p><strong>Marks per Question:</strong> {quiz.marks_per_question}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleEdit}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>

        <button
          onClick={handlePublish}
          className={`px-4 py-1.5 rounded-md text-white ${quiz.is_active ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {quiz.is_active ? "Publish" : "Unpublish"}
        </button>
      </div>
    </div>
  );
}