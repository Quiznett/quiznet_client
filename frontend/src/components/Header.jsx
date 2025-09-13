// Header.jsx
// Top navigation bar for the QuizNet app
// Supports navigation links, dark mode toggle, and responsive page-specific links

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // Icons for dark/light mode
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false); // Tracks dark/light mode
  const location = useLocation(); // Get current URL path

  // Apply/remove 'dark' class on <html> when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 shadow-md transition-colors duration-500">
      
      {/* Logo / App Title */}
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        QuizNet
      </h1>

      {/* Navigation Links */}
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

        {/* Conditional Auth Links */}
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

        {/* Dark Mode Toggle Button */}
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
