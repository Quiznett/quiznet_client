import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // Stores authenticated user info
  const [loading, setLoading] = useState(true); // Indicates auth state is being resolved

  // -----------------------------------------------------------------------------
  // Restore user session on page reload
  // Reads the "user" cookie (non-HttpOnly) which the backend sets after login.
  // -----------------------------------------------------------------------------
  useEffect(() => {
    const userCookie = Cookies.get("user");

    if (userCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userCookie));
        setUser(parsed);
      } catch {
        // Minimal production logging
        console.error("Failed to parse user cookie");
      }
    }

    setLoading(false);
  }, []);

  // -----------------------------------------------------------------------------
  // Login handler
  // Calls backend login endpoint → backend sets cookies → store user in context.
  // -----------------------------------------------------------------------------
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/auth/login/",
        credentials
      );

      // Backend returns user data and sets cookies automatically
      setUser(response.data.user);

      return response;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------------
  // Logout handler
  // Clears user session both server-side and client-side.
  // -----------------------------------------------------------------------------
  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/auth/logout/");
    } finally {
      Cookies.remove("user");
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
