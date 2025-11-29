import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuizForm({ closeForm }) {
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeLimit, setTimeLimit] = useState("");


  const modalRef = useRef(null);

  
  useEffect(() => {
    modalRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") closeForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeForm]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  if (end <= start) {
    alert("End time must be AFTER start time.");
    return; 
  }


    
    closeForm();

  
    navigate("/create-quiz", {
      state: {
        quizTitle,
        date,
        startTime,
        endTime,
         timeLimit,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={closeForm}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl bg-gray-900 text-white shadow-2xl p-8 animate-scaleIn outline-none"
        aria-labelledby="create-quiz-heading"
      >
        <h2 id="create-quiz-heading" className="text-3xl font-bold text-indigo-400 text-center mb-6">
          Create Quiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 font-medium">Quiz Title</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Start Time</label>
            <input
              type="time"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">End Time</label>
            <input
              type="time"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div>
  <label className="block mb-1 font-medium">Time Limit (minutes)</label>
  <input
    type="number"
    min="1"
    max="180"
    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
    value={timeLimit}
    onChange={(e) => setTimeLimit(e.target.value)}
    required
  />
</div>


          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Get Started
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
