# Collaborative Canvas

A **real-time, multi-user drawing application** built with HTML5 Canvas, Node.js, and Socket.io. Users can draw simultaneously on a shared canvas, see each other's cursors, and perform per-user undo actions.

---

## Features

- Real-time collaborative drawing
- Ghost cursors showing other users
- Undo functionality (per user)
- Smooth line rendering with native Canvas API
- Client-server architecture with WebSocket communication

---

## Tech Stack

- **Frontend:** HTML5 Canvas, Vanilla JavaScript
- **Backend:** Node.js, Express, Socket.io
- **Realtime Protocol:** WebSockets
- **Package Management:** npm

---

## Project Structure

```
collaborative-canvas/
├── client/
│   ├── index.html      # Main HTML UI
│   ├── style.css       # Canvas styling & layout
│   ├── canvas.js       # Core drawing logic
│   └── main.js         # Application bootstrap & socket events
├── server/
│   ├── server.js       # Node/Express server + WebSocket
│   └── state-manager.js# Global stroke history & undo logic
├── package.json
└── ARCHITECTURE.md     # System architecture documentation
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/collaborative-canvas.git
cd collaborative-canvas
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
node server/server.js
```
The server runs on port **3000** (or another available port if 3000 is busy).

### 4. Open Frontend

Open `client/index.html` in your browser. You can open multiple browser windows to simulate multiple users.

---

## How to Use

1. Click and drag on the canvas to draw.
2. See other users' cursors moving in real-time.
3. Click the **Undo** button to remove your last stroke.
4. New users joining will see the full canvas state.

---

## Technical Notes

- **Canvas Coordinates:** Mouse/touch events are normalized to the canvas resolution.
- **Stroke Structure:** Each stroke contains points, color, width, and `userId` for undo.
- **Undo Logic:** Only the latest stroke of the requesting user is removed; the server broadcasts the updated state.
- **Ghost Cursors:** The server tracks positions of all connected clients and broadcasts them.

---

## Evaluation Criteria

- Canvas Efficiency: Smooth lines, responsive drawing
- Real-Time Sync: Low latency, accurate state across users
- Advanced Logic: Undo/redo stability, conflict-free updates
- Code Quality: Modular structure, clear naming, comments

---

## License

This project is licensed under the ISC License.

