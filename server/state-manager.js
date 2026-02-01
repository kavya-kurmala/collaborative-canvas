// server/state-manager.js
// --------------------------------------------------
// Manages global drawing state (server-side truth)
// --------------------------------------------------

let strokes = [];

/**
 * Add a new stroke to global history
 */
export function addStroke(stroke) {
  strokes.push(stroke);
}

/**
 * Return all strokes (for late joiners)
 */
export function getStrokes() {
  return strokes;
}

/**
 * Undo last stroke created by a specific user
 */
export function undoStroke(userId) {
  for (let i = strokes.length - 1; i >= 0; i--) {
    if (strokes[i].userId === userId) {
      return strokes.splice(i, 1)[0];
    }
  }
  return null;
}
