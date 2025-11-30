// -----------------------------------------------------------------------------
// axios.js — Centralized Axios Instance
// -----------------------------------------------------------------------------
// This file configures a single Axios instance used across the application.
// It ensures consistent base URL, credentials handling (cookies), and headers.
//
// Environment variable:
//    VITE_API_URL → Backend API base URL
// -----------------------------------------------------------------------------

import axios from "axios";

// Backend API root URL (loaded from environment variables)
export const API_URL = import.meta.env.VITE_API_URL;

// Create a preconfigured Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,                         // All requests start from this base URL
  withCredentials: true,                    // Enables sending cookies (session/CSRF)
  headers: {
    "Content-Type": "application/json",     // Default content type
  },
});

// Export for use in API calls
export default axiosInstance;
