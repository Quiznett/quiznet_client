import { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function QuizCard({ quiz, fetchQuizzes }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  function formatLocalDateTime(utcString) {
    const date = new Date(utcString);

    return {
      localDate: date.toLocaleDateString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      localTime: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  }

  const { localDate: startDate, localTime: startTime } =
    formatLocalDateTime(quiz.initiates_on);

  const { localTime: endTime } = formatLocalDateTime(quiz.ends_on);

  const totalQuestions = quiz.question_count || 0;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axiosInstance.delete(`/api/v1/quiz/delete/${quiz.quiz_id}/`);
      fetchQuizzes();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handlePublish = () => {
    const base = import.meta.env.VITE_FRONTEND_URL;
    const link = `${base}/attempt/${quiz.quiz_id}`;

    setGeneratedLink(link);
    setShowLink(true);

    navigator.clipboard.writeText(link);
    // alert(`Quiz link copied:\n${link}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link copied!");
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
          className="px-3 py-1 bg-gray-200 dark:bg-gray-400 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setOpen(!open)}
        >
          Details
        </button>
      </div>

      {open && (
        <div
          className="
            mt-4 text-sm space-y-1 
            bg-gray-100 dark:bg-gray-700 
            p-4 rounded-lg
            text-gray-900 dark:text-gray-100
          "
        >
          <p>
            <strong className="text-gray-900 dark:text-gray-200">Date:</strong>{" "}
            {startDate}
          </p>

          <p>
            <strong className="text-gray-900 dark:text-gray-200">Time:</strong>{" "}
            {startTime} - {endTime}
          </p>

          <p>
            <strong className="text-gray-900 dark:text-gray-200">
              Total Questions:
            </strong>{" "}
            {totalQuestions}
          </p>
        </div>
      )}

      {showLink && (
        <div className="mt-4">
          <label className="block mb-1 font-medium text-green-500">Quiz Link</label>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              value={generatedLink}
            />

            <button
              onClick={copyLink}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleDelete}
          className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>

        <button
          onClick={handlePublish}
          className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Get Link
        </button>
      </div>
    </div>
  );
}
