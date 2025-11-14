// Main landing page of the QuizNet application
// This is the first page users see when they visit the app
// It highlights features, explains what the app does, and guides users to sign up

import { Link } from "react-router-dom";   // Import Link for navigation without page refresh
import Header from "../components/Header"; // Import Header (top navigation bar/logo etc.)


// React functional component -> LandingPage
export default function LandingPage() {
  return (

    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      
      {/* Header is reused from components  has logo, nav, login/register buttons */}
      <Header />

      {/* Main content of landing page */}
      <main className="flex-grow flex flex-col items-center text-center px-6 py-12">
        
        {/* Hero section = Big headline + intro text */}
        <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Ready to Quiz?
        </h2>

        {/* Short description → tells users what the app does */}
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-8">
          Sign up, create your first quiz, share with friends, and track live results in real-time.
        </p>

        {/* Call-to-action button → redirects users to Signup page */}
        <Link
          to="/signup"  // when clicked → navigates to /signup route
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-lg shadow-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>

        {/* Features section → displays 3 key features in grid layout */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          
          {/* Feature 1: Create Quizzes */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📝</span> {/* Emoji icon for quiz creation */}
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Create Quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Build interactive quizzes with multiple question types.
            </p>
          </div>

          {/* Feature 2: Share Easily */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📢</span> {/* Emoji icon for sharing */}
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Share Easily
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Share quizzes with friends, students, or colleagues instantly.
            </p>
          </div>

          {/* Feature 3: Track Results */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <span className="text-6xl">📈</span> {/* Emoji icon for analytics */}
            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
              Track Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              See responses and performance live with analytics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer is reused from components */}
     
    </div>
  );
}
