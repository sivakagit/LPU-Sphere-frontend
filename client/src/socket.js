// client/src/socket.js
import { io } from "socket.io-client";

// ✅ Use your Render backend URL
export const socket = io("https://lpu-sphere-backend.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});
