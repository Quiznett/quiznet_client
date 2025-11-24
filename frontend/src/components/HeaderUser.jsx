import { useState } from "react";
import { Moon, Sun, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HeaderUser({ username, fullname }) {
  const navigate = useNavigate();
  const { logout } = useAuth();       
  const { darkMode, setDarkMode } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md relative">
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" className="h-10 w-10" />
        <span className="text-2xl font-bold text-indigo-600">QuizNet</span>
      </div>

      <div className="flex items-center space-x-4 relative">
        {/* Theme Toggle */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800" />
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg shadow-md">
              {getInitials(fullname)}
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-700 dark:text-gray-200 transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
              <div className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{fullname}</p>
                <p className="text-gray-500 dark:text-gray-400">{username}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 text-left text-sm font-medium transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
