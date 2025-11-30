import { Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const location = useLocation();
  const { darkMode, setDarkMode } = useTheme();

  // Determine which page the user is on
  // Used to avoid showing Login/Register links on their own pages
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <header
      className="
        sticky top-0 z-50 flex justify-between items-center px-8 py-4
        bg-white dark:bg-gray-900 shadow-md transition-colors duration-500
      "
    >
      {/* App Branding */}
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" className="h-10 w-10" />
        <span className="text-2xl font-bold text-indigo-600">QuizNet</span>
      </div>

      {/* Navigation for unauthenticated users */}
      <nav className="flex items-center space-x-6 text-lg">

        <Link
          to="/"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Home
        </Link>

        {/* Hide Login link on Login page */}
        {!isLoginPage && (
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Login
          </Link>
        )}

        {/* Hide Register link on Register page */}
        {!isRegisterPage && (
          <Link
            to="/register"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Register
          </Link>
        )}

        {/* Theme Toggle */}
        <button onClick={() => setDarkMode(!darkMode)}>
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
