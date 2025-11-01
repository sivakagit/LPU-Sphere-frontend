import { io } from "socket.io-client";

export const socket = io("https://lpu-sphere-frontend-rbpx.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
});
