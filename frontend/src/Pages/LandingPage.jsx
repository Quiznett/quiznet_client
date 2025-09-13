
// Main landing page of the QuizNet application
// Provides an overview of app features and navigation to signup
// Includes Header and Footer components

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      
      {/* Header component */}
      <Header />

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center text-center px-6 py-12">
        
        {/* Hero section */}
        <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Welcome to QuizNet 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-8">
          Sign up, create your first quiz, share with friends, and track live results in real-time.
        </p>

        {/* Call-to-action button → navigates to Signup page */}
        <Link
          to="/signup"
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-lg shadow-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>

        {/* Feature highlights section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          
          {/* Create Quizzes */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📝</span>
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Create Quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Build interactive quizzes with multiple question types.
            </p>
          </div>

          {/* Share Easily */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📢</span>
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Share Easily
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Share quizzes with friends, students, or colleagues instantly.
            </p>
          </div>

          {/* Track Results */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📈</span>
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Track Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              See responses and performance live with analytics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
