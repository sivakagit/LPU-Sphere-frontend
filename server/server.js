// --- Imports ---
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// --- Models ---
const User = require("./models/User");
const ClassModel = require("./models/Class");
const Message = require("./models/Message");

// --- Express App ---
const app = express();
const server = http.createServer(app); // Required for socket.io

// --- Socket.io Setup ---
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://lpu-sphere-frontend-ten.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

// --- Middleware ---
app.use(express.json());

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://lpu-sphere-frontend-rbpx.onrender.com",
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// --- Config ---
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected:", mongoose.connection.name))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --- Health Route ---
app.get("/api/health", (req, res) =>
  res.json({ ok: true, status: "✅ Backend running fine" })
);

// --- AUTH LOGIN ---
app.post("/api/auth/login", async (req, res) => {
  const { regNo, password } = req.body;
  if (!regNo || !password)
    return res.status(400).json({ error: "regNo and password required" });

  try {
    const user = await User.findOne({ regNo });
    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.password !== password)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { regNo: user.regNo, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        regNo: user.regNo,
        name: user.name,
        role: user.role,
        classes: user.classes,
      },
    });
  } catch (err) {
    console.error("🔥 Login route error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// --- FETCH GROUP CHATS ---
app.get("/api/chats", authMiddleware, async (req, res) => {
  try {
    const regNo = req.user.regNo;
    const classes = await ClassModel.find({
      $or: [{ members: regNo }, { faculty: regNo }],
    }).lean();

    const chats = await Promise.all(
      classes.map(async (cls) => {
        const lastMsg = await Message.findOne({ classId: cls.classId })
          .sort({ createdAt: -1 })
          .lean();

        return {
          id: cls.classId,
          name: cls.className,
          avatar: cls.classId.slice(0, 4).toUpperCase(),
          type: "group",
          lastMessage: lastMsg ? lastMsg.text : "No messages yet",
          time: lastMsg ? lastMsg.createdAt : null,
          unread: 0,
        };
      })
    );

    res.json({ chats });
  } catch (err) {
    console.error("🔥 Error fetching chats:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// --- FETCH MESSAGES FOR A GROUP ---
app.get("/api/chats/:classId/messages", authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const { regNo } = req.user;

    const cls = await ClassModel.findOne({ classId });
    if (!cls) return res.status(404).json({ error: "Class not found" });
    if (!cls.members.includes(regNo) && cls.faculty !== regNo)
      return res.status(403).json({ error: "Access denied" });

    const messages = await Message.find({ classId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    console.error("🔥 Error fetching messages:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// --- SEND NEW MESSAGE ---
app.post("/api/chats/:classId/messages", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const { classId } = req.params;
    const { regNo, name } = req.user;

    if (!text?.trim())
      return res.status(400).json({ error: "Message text required" });

    const cls = await ClassModel.findOne({ classId });
    if (!cls) return res.status(404).json({ error: "Class not found" });
    if (!cls.members.includes(regNo) && cls.faculty !== regNo)
      return res.status(403).json({ error: "Not authorized" });

    const message = new Message({
      classId,
      senderRegNo: regNo,
      senderName: name,
      text,
      createdAt: new Date(),
    });

    await message.save();

    // 🔥 Emit the new message to everyone in the same class room
    io.to(classId).emit("newMessage", message);

    res.json({ message });
  } catch (err) {
    console.error("🔥 Error posting message:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// --- Root Route ---
app.get("/", (req, res) => {
  res.send("✅ LPU Sphere Backend is live and running!");
});

// --- Socket.IO Connection ---
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (classId) => {
    socket.join(classId);
    console.log(`👥 User joined room: ${classId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// --- Start Server ---
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
