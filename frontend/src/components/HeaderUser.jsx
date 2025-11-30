// -----------------------------------------------------------------------------
// HeaderUser Component
// -----------------------------------------------------------------------------
// Displayed on authenticated pages. Shows app branding, theme toggle,
// and a user profile dropdown (with initials + logout option).
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Moon, Sun, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HeaderUser({ username, fullname }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  // Toggles the visibility of the profile dropdown menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Logs the user out → backend clears cookies → redirect to login
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Generates user initials for the profile avatar (e.g., "John Doe" → "JD")
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
      
      {/* Branding / Logo */}
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" className="h-10 w-10" />
        <span className="text-2xl font-bold text-indigo-600">QuizNet</span>
      </div>

      {/* Right-side actions: theme toggle + profile menu */}
      <div className="flex items-center space-x-4 relative">
        
        {/* Dark/Light Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          
          {/* Avatar + dropdown trigger */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {/* Avatar containing initials */}
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg shadow-md">
              {getInitials(fullname)}
            </div>

            {/* Dropdown arrow */}
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

              {/* User Info */}
              <div className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {fullname}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{username}</p>
              </div>

              {/* Logout Button */}
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
