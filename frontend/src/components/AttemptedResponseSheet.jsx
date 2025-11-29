import React from "react";

export default function AttemptedResponseSheet({ attempt, onClose }) {
 

  const attemptData = attempt?.attempt; 

  
  if (!attemptData || !attemptData.responses) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-black dark:text-white">No responses found.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const responses = attemptData.responses;
  const total = responses.length;
  const correct = responses.filter((r) => r.is_correct).length;
  const wrong = responses.filter((r) => r.selected_option && !r.is_correct).length;
  const left = responses.filter((r) => r.selected_option === null).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">
            Your Response Sheet
          </h1>

          <button
            onClick={onClose}
            className="text-red-600 font-bold text-lg hover:text-red-800"
          >
            ✖
          </button>
        </div>

        <p className="dark:text-gray-300 mb-4">
          Submitted at: {new Date(attemptData.submitted_at).toLocaleString()}
        </p>

        {/* Summary Boxes */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-200 rounded-lg">
            <p className="text-2xl font-bold">{correct}</p>
            <p>Correct</p>
          </div>

          <div className="p-4 bg-red-200 rounded-lg">
            <p className="text-2xl font-bold">{wrong}</p>
            <p>Wrong</p>
          </div>

          <div className="p-4 bg-yellow-200 rounded-lg">
            <p className="text-2xl font-bold">{left}</p>
            <p>Left</p>
          </div>

          <div className="p-4 bg-gray-300 rounded-lg">
            <p className="text-2xl font-bold">{total}</p>
            <p>Total Questions</p>
          </div>
        </div>

        {/* Question Response Display */}
        {responses.map((r, idx) => (
          <div
            key={r.question_id}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl border mb-6"
          >
            <h2 className="text-lg font-semibold dark:text-white mb-3">
              Q{idx + 1}. {r.question_title}
            </h2>

            {[r.option1, r.option2, r.option3, r.option4].map((opt, i) => {
              const number = i + 1;
              const isCorrect = number === r.correct_option;
              const isSelected = number === r.selected_option;

              let bg = "bg-white dark:bg-gray-800";
              let text = "text-gray-900 dark:text-gray-200";

              if (isSelected && isCorrect) {
                bg = "bg-green-600";
                text = "text-white";
              } else if (isSelected && !isCorrect) {
                bg = "bg-red-600";
                text = "text-white";
              } else if (isCorrect) {
                bg = "bg-green-200";
                text = "text-green-900";
              }

              return (
                <div
                  key={i}
                  className={`p-3 my-2 rounded-lg border ${bg} ${text}`}
                >
                  {number}. {opt}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
