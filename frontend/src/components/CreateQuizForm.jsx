import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuizForm() {
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [marksPerQuestion, setMarksPerQuestion] = useState("");

  
  const modalRef = useRef(null);

  useEffect(() => {
    
    modalRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") navigate(-1); 
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/create-quiz", {
      state: {
        quizTitle,
        date,
        startTime,
        endTime,
        marksPerQuestion,
      },
    });
  };

  
  const handleOverlayClick = () => navigate(-1);

 
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Inner modal: stop clicks propagating to the overlay */}
      <div
        ref={modalRef}
        onClick={stopPropagation}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl bg-gray-900 text-white shadow-2xl p-8 animate-scaleIn outline-none"
        aria-labelledby="create-quiz-heading"
      >
        <h2 id="create-quiz-heading" className="text-3xl font-bold text-indigo-400 text-center mb-6">
          Create Quiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Quiz Title */}
          <div>
            <label className="block mb-1 font-medium">Quiz Title</label>
            <input
              type="text"
              placeholder="Enter quiz title"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block mb-1 font-medium">Start Time</label>
            <input
              type="time"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block mb-1 font-medium">End Time</label>
            <input
              type="time"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          {/* Marks per Question */}
          <div>
            <label className="block mb-1 font-medium">Marks per Question</label>
            <input
              type="number"
              placeholder="e.g. 2"
              min="1"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/welcome")}
              className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>

            <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
