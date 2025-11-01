import axios from "axios";

const api = axios.create({
  baseURL: "https://lpu-sphere-backend.vercel.app/api", // 👈 only one '/api'
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add JWT token automatically to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
