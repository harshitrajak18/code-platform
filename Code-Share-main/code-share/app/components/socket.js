"use client";
import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    transports: ['websocket',"pooling"],
    reconnectionAttempts: Infinity,
    timeout: 10000,
    path: "/socket.io",
  };
  console.log("value",process.env.NEXT_PUBLIC_BACKEND_URL)
  return io("http://localhost:4000", options);
};