import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuizForm({ closeForm }) {
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const modalRef = useRef(null);

  // Escape key + autofocus
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

    // Navigate to question creation page
    navigate("/create-quiz", {
      state: { quizTitle, date, startTime, endTime },
    });

    // Close modal after navigating
    closeForm();
  };

  // Clicking overlay closes modal
  const handleOverlayClick = () => closeForm();

  // Prevent closing modal when clicking inside
  const stopPropagation = (e) => e.stopPropagation();


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl bg-gray-900 text-white shadow-2xl p-8 animate-scaleIn outline-none"
        onClick={stopPropagation}
      >
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-6">
          Create Quiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Quiz Title */}
          <div>
            <label className="block mb-1 font-medium">Quiz Title</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter quiz title"
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
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeForm();
              }}
              className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
