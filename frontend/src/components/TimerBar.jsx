import React from "react";

// -----------------------------------------------------------------------------
// TimerBar Component
// -----------------------------------------------------------------------------
// Visual countdown bar used during quiz attempts.
//
// Props:
//   • current → remaining time in seconds
//   • total → total quiz duration in seconds
//
// Behavior:
//   • Fills from left to right as time decreases.
//   • If values are missing or invalid, shows an empty red bar safely.
// -----------------------------------------------------------------------------

export default function TimerBar({ current, total }) {

  // Guard: show safe fallback bar if values are missing/invalid
  if (!total || isNaN(total) || !current || isNaN(current)) {
    return (
      <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
        <div className="h-full bg-red-600" style={{ width: "0%" }}></div>
      </div>
    );
  }

  // Percentage of time used (from 0% to 100%)
  const percentage = Math.min(
    Math.max(((total - current) / total) * 100, 0),
    100
  );

  return (
    <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
      <div
        className="h-full bg-red-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
