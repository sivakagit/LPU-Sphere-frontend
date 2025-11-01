import { io } from "socket.io-client";

export const socket = io("https://lpu-sphere-backend.vercel.app", {
  transports: ["websocket"],
  reconnection: true,
});
