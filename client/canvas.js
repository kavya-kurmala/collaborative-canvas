// client/canvas.js
// --------------------------------------------------
// Handles all canvas-related logic:
// - Canvas setup & resizing
// - Coordinate mapping
// - Stroke rendering
// --------------------------------------------------

/**
 * Initialize a full-screen, DPI-safe canvas
 */
export function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Initial sizing
  resizeCanvas();

  // Resize on window resize
  window.addEventListener("resize", resizeCanvas);

  return ctx;
}

/**
 * Convert mouse/touch event to canvas coordinates
 */
export function getCanvasCoordinates(event, canvas) {
  const rect = canvas.getBoundingClientRect();

  let clientX, clientY;

  // Touch support
  if (event.touches && event.touches[0]) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

/**
 * Draw a complete stroke (used for redraw and remote strokes)
 */
export function drawStroke(ctx, stroke) {
  if (!stroke || stroke.points.length < 2) return;

  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  stroke.points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
}

/**
 * Draw a single line segment (used during live drawing)
 */
export function drawSegment(ctx, from, to, style) {
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.width;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

/**
 * Clear the entire canvas
 */
export function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Redraw all strokes from history
 */
export function redrawCanvas(ctx, canvas, strokes) {
  clearCanvas(ctx, canvas);
  strokes.forEach(stroke => drawStroke(ctx, stroke));
}

/**
 * Draw ghost cursors (not persisted)
 */
export function drawGhostCursors(ctx, cursors) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

  Object.values(cursors).forEach(cursor => {
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}
