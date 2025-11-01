// --- Imports ---
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// --- Models ---
const User = require("./models/User");
const ClassModel = require("./models/Class");
const Message = require("./models/Message");

// --- Express app ---
const app = express();

// ✅ --- CORS setup ---
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://lpu-sphere-frontend-six.vercel.app",
  "https://lpu-sphere-frontend-ecru.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// --- Config ---
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Mongo connected:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ Mongo connection error:", err.message);
  }
};
connectDB();

// --- Auth Middleware ---
const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token provided" });

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --- Routes ---
app.get("/api/health", (req, res) =>
  res.json({ ok: true, status: "Backend running" })
);

app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await User.find({}, { _id: 0, regNo: 1, name: 1 });
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Auth Route ---
app.post("/api/auth/login", async (req, res) => {
  const { regNo, password } = req.body;

  if (!regNo || !password) {
    return res.status(400).json({ error: "regNo and password required" });
  }

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
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Chat Routes ---
app.get("/api/chats", authMiddleware, async (req, res) => {
  try {
    const regNo = req.user.regNo;
    const classes = await ClassModel.find({
      $or: [{ members: regNo }, { faculty: regNo }],
    }).select("-__v");

    const chats = await Promise.all(
      classes.map(async (c) => {
        const msg = await Message.findOne({ classId: c.classId })
          .sort({ createdAt: -1 })
          .lean();

        return {
          id: c.classId,
          name: c.className || c.name,
          avatar: c.classId?.substring(0, 5) || "CLASS",
          type: "group",
          lastMessage: msg ? msg.text : null,
          time: msg ? msg.createdAt : null,
          unread: 0,
        };
      })
    );

    res.json({ chats });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Messages Routes ---
app.get("/api/chats/:classId/messages", authMiddleware, async (req, res) => {
  try {
    const { regNo } = req.user;
    const { classId } = req.params;

    const cls = await ClassModel.findOne({ classId });
    if (!cls) return res.status(404).json({ error: "Class not found" });

    if (!cls.members.includes(regNo) && cls.faculty !== regNo) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const messages = await Message.find({ classId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/chats/:classId/messages", authMiddleware, async (req, res) => {
  try {
    const { regNo } = req.user;
    const { classId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Text required" });

    const cls = await ClassModel.findOne({ classId });
    if (!cls) return res.status(404).json({ error: "Class not found" });

    if (!cls.members.includes(regNo) && cls.faculty !== regNo) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const user = await User.findOne({ regNo });
    const message = new Message({
      classId,
      senderRegNo: regNo,
      senderName: user?.name || regNo,
      text,
      createdAt: new Date(),
    });

    await message.save();
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Root Route ---
app.get("/", (req, res) => {
  res.send("✅ LPU Sphere Backend is live and running!");
});

// --- Export for Vercel ---
module.exports = app;

// --- Local Dev Mode ---
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
