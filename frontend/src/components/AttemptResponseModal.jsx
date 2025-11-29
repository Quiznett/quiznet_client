import React from "react";

export default function ResponsePopup({ attempt, onClose }) {
  const total = attempt.responses.length;
  const correct = attempt.responses.filter((r) => r.is_correct).length;
  const wrong = attempt.responses.filter(
    (r) => r.selected_option && !r.is_correct
  ).length;
  const left = attempt.responses.filter((r) => r.selected_option === null)
    .length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm 
                    flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">

        <button onClick={onClose} className="float-right text-red-500 text-xl">
          ✖
        </button>

        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          {attempt.full_name}'s Response Sheet
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mb-4">
          Submitted: {new Date(attempt.submitted_at).toLocaleString()}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-green-200 rounded-lg">
            <p className="text-xl font-bold">{correct}</p>
            <p>Correct</p>
          </div>
          <div className="p-3 bg-red-200 rounded-lg">
            <p className="text-xl font-bold">{wrong}</p>
            <p>Wrong</p>
          </div>
          <div className="p-3 bg-yellow-200 rounded-lg">
            <p className="text-xl font-bold">{left}</p>
            <p>Left</p>
          </div>
          <div className="p-3 bg-gray-300 rounded-lg">
            <p className="text-xl font-bold">{total}</p>
            <p>Total</p>
          </div>
        </div>

        {attempt.responses.map((r, idx) => {
          return (
            <div
              key={r.question_id}
              className="p-3 mb-4 rounded-lg border dark:border-gray-700 
                         bg-white dark:bg-gray-900"
            >
              <h2 className="text-lg font-semibold dark:text-white mb-2">
                Q{idx + 1}. {r.question_title}
              </h2>

              {[r.option1, r.option2, r.option3, r.option4].map((opt, i) => {
                const optionNum = i + 1;
                const isCorrect = optionNum === r.correct_option;
                const isSelected = optionNum === r.selected_option;

                let bg = "bg-gray-200 dark:bg-gray-700";
                if (isSelected && isCorrect) bg = "bg-green-600 text-white";
                else if (isSelected) bg = "bg-red-600 text-white";
                else if (isCorrect) bg = "bg-green-200 text-green-900";

                return (
                  <div key={i} className={`p-2 rounded mb-1 ${bg}`}>
                    {optionNum}. {opt}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
