// -----------------------------------------------------------------------------
// File: ThemeContext.jsx
// Purpose:
//   - Provides global theme state (light/dark mode) across the application.
//   - Persists user theme preference in localStorage.
//   - Toggles Tailwind's `dark` class on the <html> element to switch themes.
//   - Exposes `darkMode` and `setDarkMode` through React Context for global use.
// -----------------------------------------------------------------------------



import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // -----------------------------------------------------------------------------
  // Persisted theme state
  // Reads initial mode from localStorage to preserve user preference
  // across page reloads.
  // -----------------------------------------------------------------------------
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // -----------------------------------------------------------------------------
  // Apply theme changes to the <html> element and store preference
  // Tailwind's dark mode is class-based, so we toggle the "dark" class.
  // -----------------------------------------------------------------------------
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to access theme values anywhere in the app
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
