// src/api/axios.ts
import axios from "axios";

// 🧠 DEBUG: Check what VITE_API_URL is
console.log("🌍 VITE_API_URL =", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://lpu-sphere-backend.vercel.app/api",
});

export default api;
