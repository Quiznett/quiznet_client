import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach access token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const resp = await axios.post(
          `${API_URL}/api/v1/auth/refresh/`,
          {},
          { withCredentials: true }
        );

        const newAccess = resp.data.access;
        localStorage.setItem("access", newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(original);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("user");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
