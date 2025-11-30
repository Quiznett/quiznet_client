import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from readable cookie on refresh
  useEffect(() => {
    const userCookie = Cookies.get("user"); // NOT HttpOnly, readable
    
    if (userCookie) {
      try {
        const decoded = JSON.parse(decodeURIComponent(userCookie));
        setUser(decoded);
      } catch (err) {
        console.error("Cookie parse error:", err);
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/v1/auth/login/", credentials);

      // backend already sets cookies, including user cookie
      setUser(res.data.user);

      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axiosInstance.post("/api/v1/auth/logout/");
    Cookies.remove("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
