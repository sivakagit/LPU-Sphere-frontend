// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://lpu-sphere-frontend.onrender.com", // no trailing slash!
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to every request
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

export default api;
