// server/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

import {
  addStroke,
  getStrokes,
  undoStroke
} from "./state-manager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // Send full canvas state to new user
  socket.emit("init", getStrokes());

  // Receive completed stroke
  socket.on("stroke", stroke => {
    addStroke(stroke);
    socket.broadcast.emit("stroke", stroke);
  });

  // Undo request
  socket.on("undo", () => {
    const removed = undoStroke(socket.id);
    if (removed) {
      io.emit("undo", removed.id);
    }
  });

  // Ghost cursor updates
  socket.on("cursor", pos => {
    socket.broadcast.emit("cursor", {
      id: socket.id,
      ...pos
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(9000, () => {
  console.log("Server running on http://localhost:9000");
});
