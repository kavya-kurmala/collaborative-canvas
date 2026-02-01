export function setupSocket(drawStroke, redraw) {
  const socket = io("http://localhost:9000");

  socket.on("init", strokes => redraw(strokes));
  socket.on("stroke", stroke => drawStroke(stroke));
  socket.on("undo", () => redraw());
  socket.on("cursor", data => window.cursors[data.id] = data);

  return socket;
}
