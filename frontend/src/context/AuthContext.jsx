// -----------------------------------------------------------------------------
// File: AuthContext.jsx
// Purpose:
//   - Manages global authentication state for the entire application.
//   - Restores user session from localStorage on page reload.
//   - Stores authenticated user info in localStorage instead of cookies.
//   - Uses Django sessionid (HttpOnly) for actual authentication security.
// -----------------------------------------------------------------------------

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Authenticated user info
  const [loading, setLoading] = useState(true); // Resolving stored session

  // -----------------------------------------------------------------------------
  // Restore user session on page reload (from localStorage)
  // -----------------------------------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // -----------------------------------------------------------------------------
  // Login handler (store user info to localStorage)
  // -----------------------------------------------------------------------------
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/auth/login/",
        credentials
      );

      const userData = response.data.user;

      // Store user
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return response;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------------
  // Logout handler (clears localStorage + invalidates server session)
  // -----------------------------------------------------------------------------
  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/auth/logout/");
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
