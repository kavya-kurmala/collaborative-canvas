// client/main.js
import {
  setupCanvas,
  getCanvasCoordinates,
  drawStroke
} from "./canvas.js";

import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { v4 as uuid } from "https://cdn.skypack.dev/uuid";

const canvas = document.getElementById("canvas");
const undoBtn = document.getElementById("undo");

const ctx = setupCanvas(canvas);
const socket = io("http://localhost:9000");

let strokes = [];
let currentStroke = null;
let isDrawing = false;

// Store ghost cursors
window.cursors = {};

/* ---------------- SOCKET EVENTS ---------------- */

// Initial canvas state (late joiners)
socket.on("init", serverStrokes => {
  strokes = serverStrokes;
  redrawAll();
});

// New stroke from another user
socket.on("stroke", stroke => {
  strokes.push(stroke);
  drawStroke(ctx, stroke);
});

// Undo broadcast
socket.on("undo", () => {
  redrawAll();
});

// Ghost cursor updates
socket.on("cursor", data => {
  window.cursors[data.id] = data;
});

/* ---------------- DRAWING EVENTS ---------------- */

canvas.addEventListener("mousedown", e => {
  isDrawing = true;

  currentStroke = {
    id: uuid(),
    userId: socket.id,
    color: "#000000",
    width: 5,
    points: [getCanvasCoordinates(e, canvas)]
  };
});

canvas.addEventListener("mousemove", e => {
  if (!isDrawing || !currentStroke) return;

  const point = getCanvasCoordinates(e, canvas);
  currentStroke.points.push(point);

  // Draw locally
  drawStroke(ctx, currentStroke);

  // Send ghost cursor position
  socket.emit("cursor", point);
});

canvas.addEventListener("mouseup", () => {
  if (!currentStroke) return;

  strokes.push(currentStroke);
  socket.emit("stroke", currentStroke);

  currentStroke = null;
  isDrawing = false;
});

/* ---------------- UNDO BUTTON ---------------- */

undoBtn.addEventListener("click", () => {
  socket.emit("undo");
});

/* ---------------- RENDER HELPERS ---------------- */

function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokes.forEach(stroke => drawStroke(ctx, stroke));
  drawCursors();
}

function drawCursors() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";

  Object.values(window.cursors).forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}
