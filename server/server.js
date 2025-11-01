// --- Imports ---
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// --- Models ---
const User = require("./models/User");
const ClassModel = require("./models/Class");
const Message = require("./models/Message");

// --- Express App ---
const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://lpu-sphere-frontend-ten.vercel.app",
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

app.use(express.json());

// --- Config ---
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected:", mongoose.connection.name);
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --- Routes ---

app.get("/api/health", (req, res) => res.json({ ok: true, status: "Backend running" }));

// ✅ Auth Route
app.post("/api/auth/login", async (req, res) => {
  const { regNo, password } = req.body;
  if (!regNo || !password)
    return res.status(400).json({ error: "regNo and password required" });

  try {
    const user = await User.findOne({ regNo });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

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
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Chat List (Groups) — persistent after logout
app.get("/api/chats", authMiddleware, async (req, res) => {
  try {
    const regNo = req.user.regNo;

    const classes = await ClassModel.find({
      $or: [{ members: regNo }, { faculty: regNo }],
    })
      .select("-__v")
      .lean();

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
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Message List (per group)
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
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Send a new message (saved in Mongo)
app.post("/api/chats/:classId/messages", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const { classId } = req.params;
    const { regNo, name } = req.user;

    if (!text.trim()) return res.status(400).json({ error: "Text required" });

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

    res.json({ message });
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Root Route ---
app.get("/", (req, res) => res.send("✅ LPU Sphere Backend is live!"));

// --- Export for Vercel ---
module.exports = app;

// --- Local Dev Mode ---
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
