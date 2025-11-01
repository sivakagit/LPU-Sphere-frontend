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
const server = http.createServer(app);

// --- Config ---
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// --- Allowed Origins ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://lpu-sphere-frontend-rbpx.onrender.com",
];

// --- Middleware ---
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// --- Socket.io Setup ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// --- JWT Middleware ---
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// --- Auth Login ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { regNo, password } = req.body;
    if (!regNo || !password)
      return res.status(400).json({ success: false, message: "regNo and password required" });

    const user = await User.findOne({ regNo });
    if (!user)
      return res.status(401).json({ success: false, message: "User not found" });

    if (user.password !== password)
      return res.status(401).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { regNo: user.regNo, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    const safeUser = {
      regNo: user.regNo,
      name: user.name,
      role: user.role,
      classes: user.classes,
    };

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// --- Fetch all chats for user ---
app.get("/api/chats", authMiddleware, async (req, res) => {
  const { regNo } = req.user;
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
        lastMessage: lastMsg?.text || "No messages yet",
        time: lastMsg?.createdAt || null,
      };
    })
  );

  res.json({ success: true, chats });
});

// --- Fetch messages for a group ---
app.get("/api/chats/:classId/messages", authMiddleware, async (req, res) => {
  const { classId } = req.params;
  const { regNo } = req.user;

  const cls = await ClassModel.findOne({ classId });
  if (!cls) return res.status(404).json({ success: false, message: "Class not found" });
  if (!cls.members.includes(regNo) && cls.faculty !== regNo)
    return res.status(403).json({ success: false, message: "Access denied" });

  const messages = await Message.find({ classId }).sort({ createdAt: 1 });
  res.json({ success: true, messages });
});

// --- SOCKET.IO ---
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // ✅ NEW: Allow users to join their personal room for notifications
  socket.on("joinUserRoom", (regNo) => {
    socket.join(regNo);
    console.log(`👤 User ${regNo} joined personal room`);
  });

  socket.on("joinRoom", (classId) => {
    socket.join(classId);
    console.log(`👥 Joined room: ${classId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { classId, regNo, name, text } = data;
      if (!text?.trim()) return;

      const message = new Message({
        classId,
        senderRegNo: regNo,
        senderName: name,
        text,
        createdAt: new Date(),
      });

      await message.save();
      
      // Emit to all users in the room
      io.to(classId).emit("newMessage", message);

      // ✅ NEW: Send notifications to all class members (except sender)
      const cls = await ClassModel.findOne({ classId }).lean();
      if (cls) {
        const recipients = [...cls.members, cls.faculty].filter(
          (r) => r && r !== regNo
        );

        recipients.forEach((r) => {
          io.to(r).emit("notification", {
            type: "message",
            classId: classId,
            className: cls.className,
            title: `New message in ${cls.className}`,
            message: `${name}: ${text}`,
            senderName: name,
            link: `/chat/${classId}`,
          });
        });
      }
    } catch (err) {
      console.error("🔥 sendMessage error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

// --- Root ---
app.get("/", (req, res) => res.send("✅ LPU Sphere backend running with realtime chat!"));

server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);