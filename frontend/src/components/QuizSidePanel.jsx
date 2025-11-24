import React from "react";

export default function QuizSidePanel({
  questions,
  responses,
  currentIndex,
  jumpTo
}) {
  return (
    <aside className="hidden md:block w-52 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
        Questions
      </h2>

      <div className="grid grid-cols-4 gap-3">
        {questions.map((q, index) => {
          const isAnswered = !!responses[q.question_id];
          const isCurrent = index === currentIndex;

          return (
            <button
              key={q.question_id}
              onClick={() => jumpTo(index)}
              className={`
                w-10 h-10 flex items-center justify-center rounded-lg border 
                transition text-sm font-semibold
                ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-700"
                    : isAnswered
                    ? "bg-green-500 text-white border-green-700"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 border-gray-400"
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
