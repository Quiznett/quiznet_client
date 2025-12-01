// -----------------------------------------------------------------------------
// axios.js — Centralized Axios Instance
// Purpose:
//   - Sends requests to backend with credentials (sessionid + csrf cookies).
//   - localStorage  stores only user info (NOT tokens).
// -----------------------------------------------------------------------------

import axios from "axios";

// Backend API root URL (environment variable)
export const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,                
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
