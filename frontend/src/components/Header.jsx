import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // Initialize darkMode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // Apply dark class and save preference in localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 shadow-md transition-colors duration-500">
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        QuizNet
      </h1>

      <nav className="flex items-center space-x-6 text-lg">
        <Link
          to="/"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Contact
        </Link>
        <Link
          to="/events"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Events
        </Link>

        {location.pathname === "/login" ? (
          <Link
            to="/signup"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Register
          </Link>
        ) : location.pathname === "/signup" ? (
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Login
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Register
            </Link>
          </>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800" />
          )}
        </button>
      </nav>
    </header>
  );
}
