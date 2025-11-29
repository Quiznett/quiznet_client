import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/api/v1/auth/refresh/`,
          {},
          { withCredentials: true }
        );

        const access = res.data.access;
        if (access) localStorage.setItem("access", access);

        
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="));

        if (userCookie) {
          const value = decodeURIComponent(userCookie.split("=")[1]);
          const parsedUser = JSON.parse(value);

          localStorage.setItem("user", JSON.stringify(parsedUser));
          setUser(parsedUser);
        }
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // LOGIN
  const login = async (credentials) => {
    const res = await axios.post(
      `${API_URL}/api/v1/auth/login/`,
      credentials,
      { withCredentials: true }
    );

    const access = res.data.access;
    if (access) localStorage.setItem("access", access);

    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);

    return res;
  };

  // LOGOUT
  const logout = async () => {
    await axios.post(
      `${API_URL}/api/v1/auth/logout/`,
      {},
      { withCredentials: true }
    );

    localStorage.removeItem("access");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);