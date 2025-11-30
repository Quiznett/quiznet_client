// -----------------------------------------------------------------------------
// File: LandingPage.jsx
// Purpose:
//   - Public homepage of the application (no login required).
//   - Introduces the platform and highlights key features.
//   - Provides a call-to-action button for users to get started (login/signup).
//   - Displays feature sections like creating quizzes, attempting quizzes,
//     and tracking results.
// -----------------------------------------------------------------------------


import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">

      {/* Public site header (logo + navigation) */}
      <Header />

      <main className="flex-grow flex flex-col items-center text-center px-6 py-12">

        {/* Main hero text */}
        <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Ready to Quiz?
        </h2>

        {/* Short tagline */}
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-8">
          Sign up, create your first quiz, attempt quizzes, and view your results!
        </p>

        {/* Primary CTA to login / get started */}
        <Link
          to="/login"
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-lg shadow-lg hover:bg-indigo-700 transition"
        >
          Getting Started
        </Link>

        {/* Feature highlights section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">

          {/* Feature 1: Create quizzes */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📝</span>
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Create Quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Build interactive quizzes with ease.
            </p>
          </div>

          {/* Feature 2: Track results */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📈</span>
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Track Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Monitor your progress and performance over time.
            </p>
          </div>

          {/* Feature 3: Attempt quizzes */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">🎯</span>
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Attempt Quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Attempt quizzes and test your knowledge.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
