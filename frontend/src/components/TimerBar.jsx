import React from "react";

export default function TimerBar({ current, total }) {
  const percentage = ((total - current) / total) * 100;

  return (
    <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
      <div
        className="h-full bg-red-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
