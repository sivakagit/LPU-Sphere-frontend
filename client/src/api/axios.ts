// client/src/api/axios.ts
import axios from "axios";

// ✅ Correct backend URL (with /api prefix for all endpoints)
const BASE_URL = import.meta.env.VITE_API_URL || "https://lpu-sphere-backend.vercel.app";

// Create Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ ensures api.post("/auth/login") → https://.../api/auth/login
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ✅ Attach token automatically for protected routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Centralized error handling (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
