import { Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const location = useLocation();
  const { darkMode, setDarkMode } = useTheme();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 shadow-md 
        transition-colors duration-500">

      <div className="flex items-center gap-2">
        <img src="/favicon.ico" className="h-10 w-10" />
        <span className="text-2xl font-bold text-indigo-600">QuizNet</span>
      </div>

      <nav className="flex items-center space-x-6 text-lg">
        
        <Link
          to="/"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Home
        </Link>

        
        {!isLoginPage && (
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Login
          </Link>
        )}

        {!isRegisterPage && (
          <Link
            to="/register"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Register
          </Link>
        )}

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
