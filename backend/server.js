require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ─── MongoDB ──────────────────────────────────────────────────────────────────

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

const MessageSchema = new mongoose.Schema(
  { text: { type: String, required: true }, username: { type: String, default: "Anonymous" } },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);

// ─── Online Users Registry ────────────────────────────────────────────────────
// Map: socketId → username
const onlineUsers = new Map();

const broadcastOnlineUsers = () => {
  const list = Array.from(onlineUsers.entries()).map(([socketId, username]) => ({
    socketId,
    username,
  }));
  io.emit("onlineUsers", list);
};

// ─── Socket.io ────────────────────────────────────────────────────────────────

io.on("connection", (socket) => {
  console.log(`🟢 Connected: ${socket.id}`);

  // ── Register username ──────────────────────────────────────────────────────
  socket.on("register", ({ username }) => {
    if (!username) return;

    // Handle duplicate usernames: append a number
    let finalName = username;
    const existingNames = new Set(onlineUsers.values());
    if (existingNames.has(username)) {
      let i = 2;
      while (existingNames.has(`${username}${i}`)) i++;
      finalName = `${username}${i}`;
      // Notify the client of the name change
      socket.emit("nameAssigned", { username: finalName });
    }

    onlineUsers.set(socket.id, finalName);
    broadcastOnlineUsers();
    console.log(`👤 Registered: ${finalName} (${socket.id})`);
  });

  // ── Group message ──────────────────────────────────────────────────────────
  socket.on("sendMessage", async ({ text, username }) => {
    if (!text) return;
    try {
      const saved = await Message.create({ text, username: username || "Anonymous" });
      io.emit("receiveMessage", {
        text: saved.text,
        username: saved.username,
        createdAt: saved.createdAt,
      });
    } catch (err) {
      console.log("❌ DB Error:", err);
    }
  });

  // ── Private DM ─────────────────────────────────────────────────────────────
  socket.on("sendDM", ({ to, text, from }) => {
    if (!to || !text || !from) return;

    const payload = {
      text,
      from,
      to,
      createdAt: new Date().toISOString(),
    };

    // Find recipient's socket
    const recipientSocketId = [...onlineUsers.entries()].find(
      ([, name]) => name === to
    )?.[0];

    // Send to recipient
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveDM", payload);
    }

    // Echo back to sender (so their own bubble appears as "sent")
    socket.emit("receiveDM", payload);

    console.log(`💬 DM: ${from} → ${to}: "${text}"`);
  });

  // ── Disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    broadcastOnlineUsers();
    console.log(`🔴 Disconnected: ${username ?? socket.id}`);
  });
});

// ─── REST ─────────────────────────────────────────────────────────────────────

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/health", (req, res) =>
  res.json({ status: "ok", online: onlineUsers.size })
);

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
