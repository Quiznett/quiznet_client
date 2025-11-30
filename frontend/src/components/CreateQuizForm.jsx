import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuizForm({ closeForm }) {
  const navigate = useNavigate();

  // Form fields
  const [quizTitle, setQuizTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  // Validation errors
  const [timeError, setTimeError] = useState("");
  const [limitError, setLimitError] = useState("");

  const modalRef = useRef(null);

  // -----------------------------------------------------------------------------
  // Validate date/time fields automatically:
  //  - End time must be after start time
  //  - Time limit cannot exceed the duration between start and end
  // -----------------------------------------------------------------------------
  useEffect(() => {
    if (!date || !startTime || !endTime) return;

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    setTimeError("");
    setLimitError("");

    // End time must be later than start time
    if (end <= start) {
      setTimeError("End time must be AFTER start time.");
      return;
    }

    // Time limit cannot exceed available duration
    if (timeLimit) {
      const availableMinutes = (end - start) / (1000 * 60);

      if (Number(timeLimit) > availableMinutes) {
        setLimitError(
          `Time limit cannot exceed available time (${availableMinutes} minutes).`
        );
      }
    }
  }, [date, startTime, endTime, timeLimit]);

  // -----------------------------------------------------------------------------
  // Modal Accessibility:
  //  - Focus modal automatically
  //  - Close form on Escape key
  // -----------------------------------------------------------------------------
  useEffect(() => {
    modalRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeForm();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeForm]);

  // -----------------------------------------------------------------------------
  // Submit handler:
  //  - Prevent submission if validations fail
  //  - Pass valid data to /create-quiz page through navigation state
  // -----------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (timeError || limitError) return;

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
        <h2
          id="create-quiz-heading"
          className="text-3xl font-bold text-indigo-400 text-center mb-6"
        >
          Create Quiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Quiz Title */}
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

          {/* Date */}
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

          {/* Start Time */}
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

          {/* End Time */}
          <div>
            <label className="block mb-1 font-medium">End Time</label>
            <input
              type="time"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
            {timeError && (
              <p className="text-red-500 text-sm mt-1">{timeError}</p>
            )}
          </div>

          {/* Time Limit */}
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
            {limitError && (
              <p className="text-red-500 text-sm mt-1">{limitError}</p>
            )}
          </div>

          {/* Action Buttons */}
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
