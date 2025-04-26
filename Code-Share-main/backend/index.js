import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Add CORS support
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*", // Change "*" to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

const userSockerMap = {};

const getAllConnectedClients = (roomId) => {
  return (
    Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId) => {
      return { socketId, username: userSockerMap[socketId] };
    }) || []
  );
};

io.on("connection", (socket) => {

  socket.on("join", (data) => {
    const { roomId, username } = data;
    userSockerMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSockerMap[socket.id],
      });
    });
    delete userSockerMap[socket.id];
    socket.leave();
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", { code });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log("Listening on port 4000");
});
