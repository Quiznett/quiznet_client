import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";

import axiosInstance from "../api/axios";
import GlobalLoader from "../components/GloblaLoader";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading } = useAuth();

  // Quiz metadata passed from previous page (title, schedule, limits, etc.)
  const { quizTitle, date, startTime, endTime, timeLimit } = location.state || {};

  // If any required info is missing, return user back safely
  if (!quizTitle || !date || !startTime || !endTime) {
    navigate(-1);
  }

  // ==========================================================
  // QUESTIONS STATE
  // Each question contains:
  // - question text
  // - four options
  // - correct option (1–4)
  // ==========================================================
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctOption: "1" },
  ]);

  // Add a new empty question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctOption: "1" },
    ]);
  };

  // Remove a specific question block
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Update question text
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // Update one of the 4 options
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Change correct answer for a question
  const handleCorrectOptionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctOption = value;
    setQuestions(updated);
  };

  // ==========================================================
  // CREATE QUIZ API CALL
  // Builds final payload → sends to backend → redirects to MyQuizzes
  // ==========================================================
  const handleSaveQuiz = async () => {
    // Prevent saving quiz with completely empty first question
    const firstQ = questions[0];
    const isEmptyQuestion =
      !firstQ.question.trim() &&
      firstQ.options.every((opt) => !opt.trim());

    if (isEmptyQuestion) {
      alert("Please add at least one complete question before saving the quiz.");
      return;
    }

    try {
      // Build correct ISO timestamps
      const start = new Date(`${date}T${startTime}:00`);
      const end = new Date(`${date}T${endTime}:00`);

      // Basic time validation
      if (timeLimit <= 0) {
        alert("End time must be after start time.");
        return;
      }

      // Build payload according to API schema
      const quizPayload = {
        quiz_title: quizTitle,
        initiates_on: start.toISOString(),
        ends_on: end.toISOString(),
        time_limit_minutes: timeLimit,
        is_active: true,
        questions: questions.map((q) => ({
          question_title: q.question || "Untitled Question",
          option1: q.options[0] || "Option 1",
          option2: q.options[1] || "Option 2",
          option3: q.options[2] || "Option 3",
          option4: q.options[3] || "Option 4",
          answer: parseInt(q.correctOption),
        })),
      };

      await axiosInstance.post(`/api/v1/quiz/create/`, quizPayload);

      // Redirect to all quizzes once saved
      navigate("/myQuizzes");
    } catch {
      // Error is not shown in detail to user — simple message only
      alert("Failed to create quiz.");
    }
  };

  // Global auth loader
  if (loading) return <GlobalLoader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Top header with user info */}
      <HeaderUser username={user.username} fullname={user.fullname} />

      <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ==========================================================
            LEFT SIDE → QUESTION BUILDER
        ========================================================== */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">

            {/* Back button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-600 hover:text-white transition"
              >
                <ArrowLeft size={22} />
              </button>

              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Create Questions
              </h1>
            </div>

            {/* Save quiz button */}
            <button
              onClick={handleSaveQuiz}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition"
            >
              <Save size={18} /> Save Quiz
            </button>
          </div>

          {/* List of question blocks */}
          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl shadow-sm relative"
              >
                {/* Remove question button (hidden for first question) */}
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <h2 className="text-lg font-semibold text-indigo-600 mb-3">
                  Question {qIndex + 1}
                </h2>

                {/* Question input */}
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder="Type your question..."
                  className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {/* All 4 options */}
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-grow p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-1 focus:ring-indigo-400 outline-none"
                    />
                  </div>
                ))}

                {/* Correct option selector */}
                <div className="mt-4">
                  <label className="block text-sm mb-2 text-indigo-500 font-medium">
                    Correct Option
                  </label>

                  <select
                    value={q.correctOption}
                    onChange={(e) =>
                      handleCorrectOptionChange(qIndex, e.target.value)
                    }
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="1">{q.options[0] || "Option 1"}</option>
                    <option value="2">{q.options[1] || "Option 2"}</option>
                    <option value="3">{q.options[2] || "Option 3"}</option>
                    <option value="4">{q.options[3] || "Option 4"}</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add another question */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-md hover:scale-105 transition-all"
            >
              <Plus size={20} /> Add Question
            </button>
          </div>
        </div>

        {/* ==========================================================
            RIGHT SIDE → LIVE QUIZ PREVIEW
            Helps creator review all questions before saving
        ========================================================== */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            🧾 Quiz Preview
          </h2>

          <h3 className="text-xl font-semibold mb-2">{quizTitle}</h3>

          {/* Summary of metadata */}
          <p className="text-gray-500 mb-6">
            Date: {date} | Time: {startTime} — {endTime}
            <br />
            Total Questions: {questions.length}
          </p>

          {/* Render preview of all questions */}
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Q{qIndex + 1}.{" "}
                {q.question || (
                  <span className="text-gray-500 italic">No question text</span>
                )}
              </h4>

              <ul className="space-y-2">
                {q.options.map((opt, oIndex) => (
                  <li
                    key={oIndex}
                    className={`p-2 rounded-md ${
                      parseInt(q.correctOption) === oIndex + 1
                        ? "bg-green-100 dark:bg-green-900/40"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {opt || (
                      <span className="text-gray-400 italic">Empty option</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
