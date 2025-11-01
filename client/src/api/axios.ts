// src/api/axios.ts
import axios from "axios";



const api = axios.create({
  baseURL: "https://lpu-sphere-backend.vercel.app/api",
});

export default api;
