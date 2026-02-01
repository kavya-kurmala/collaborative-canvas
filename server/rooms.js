// server/rooms.js
// --------------------------------------------------
// Manages multiple drawing rooms
// Each room has its own stroke history
// --------------------------------------------------

const rooms = new Map();

/**
 * Get or create a room
 */
export function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, []);
  }
  return rooms.get(roomId);
}

/**
 * Add stroke to a specific room
 */
export function addStrokeToRoom(roomId, stroke) {
  const room = getRoom(roomId);
  room.push(stroke);
}

/**
 * Undo last stroke from user in a room
 */
export function undoStrokeInRoom(roomId, userId) {
  const room = getRoom(roomId);
  for (let i = room.length - 1; i >= 0; i--) {
    if (room[i].userId === userId) {
      return room.splice(i, 1)[0];
    }
  }
  return null;
}

/**
 * Get all strokes in a room
 */
export function getRoomState(roomId) {
  return getRoom(roomId);
}
