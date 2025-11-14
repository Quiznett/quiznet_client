import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import api from "../api/axios"; 

export default function CreateQuiz() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🌙 Dark mode
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // 👤 User info
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    
    const token = sessionStorage.getItem("access");
    const user = sessionStorage.getItem("username");
    const name = sessionStorage.getItem("fullname");

    if (token && user) {
      setUsername(user);
      setFullname(name || user);
      return;
    }

   
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find((c) => c.startsWith("user="));
    if (userCookie) {
      try {
        const decoded = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
        setUsername(decoded.username);
        setFullname(decoded.fullname);
        sessionStorage.setItem("username", decoded.username);
        sessionStorage.setItem("fullname", decoded.fullname);
      } catch (err) {
        console.error("Error decoding user cookie:", err);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("logout/");
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      sessionStorage.clear();
      navigate("/login");
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  const quizInfo = location.state || {};
  const {
    quizTitle: title = "Untitled Quiz",
    date = "",
    startTime = "",
    endTime = "",
    marksPerQuestion = 1,
    totalQuestions = 0,
  } = quizInfo;

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctOption: "1" },
  ]);

  const addQuestion = () =>
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctOption: "1" }]);

  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctOption = value;
    setQuestions(updated);
  };


  const handleSaveQuiz = async () => {
    try {
      const token = sessionStorage.getItem("access");
      if (!token) {
        alert("❌ You are not logged in.");
        navigate("/login");
        return;
      }

      if (!date || !startTime || !endTime) {
        alert("❌ Please select date, start time, and end time for the quiz.");
        return;
      }

      const start = new Date(`${date}T${startTime}:00`);
      const end = new Date(`${date}T${endTime}:00`);
      const timeLimit = Math.floor((end - start) / 60000);
      if (timeLimit <= 0) {
        alert(" End time must be after start time.");
        return;
      }

      if (questions.length === 0) {
        alert(" Please add at least one question.");
        return;
      }

      const quizPayload = {
        quiz_title: title || "Untitled Quiz",
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
          answer:
            parseInt(q.correctOption) >= 1 && parseInt(q.correctOption) <= 4
              ? parseInt(q.correctOption)
              : 1,
        })),
      };

      await api.post("http://127.0.0.1:8000/api/v1/quiz/create/", quizPayload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      
      navigate("/myQuizzes"); 
    } catch (error) {
      console.error("Error creating quiz:", error.response || error);
      alert("❌ Failed to create quiz.");
    }
  };

  const totalMarks = questions.length * marksPerQuestion;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition-colors duration-500">
      <HeaderUser
        username={username}
        fullname={fullname}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleLogout={handleLogout}
        getInitials={getInitials}
      />

      <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT SIDE: CREATE QUESTIONS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
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

            <button
              onClick={handleSaveQuiz}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition"
            >
              <Save size={18} /> Save Quiz
            </button>
          </div>

          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl shadow-sm relative"
              >
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

                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder="Type question..."
                  className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-grow p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-1 focus:ring-indigo-400 outline-none"
                    />
                  </div>
                ))}

                <div className="mt-4">
                  <label className="block text-sm mb-2 text-indigo-500 font-medium">
                    Correct Option
                  </label>
                  <select
                    value={q.correctOption}
                    onChange={(e) => handleCorrectOptionChange(qIndex, e.target.value)}
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

          <div className="mt-8 flex justify-center">
            <button
              onClick={addQuestion}
              disabled={totalQuestions && questions.length >= totalQuestions}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-md transition-all ${
                totalQuestions && questions.length >= totalQuestions
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
              }`}
            >
              <Plus size={20} /> Add Question
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: PREVIEW */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            🧾 Quiz Preview
          </h2>

          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">
            Date: {date} | Time: {startTime} - {endTime} <br />
            Total Questions: {questions.length}
            {totalQuestions ? ` / ${totalQuestions}` : ""} | Total Marks: {totalMarks}
          </p>

          {questions.length > 0 ? (
            questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-6">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Q{qIndex + 1}.{" "}
                  {q.question || <span className="text-gray-500 italic">No question text</span>}
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
                      {opt || <span className="text-gray-400 italic">Empty option</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No questions added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
