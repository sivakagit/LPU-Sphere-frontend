const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Explicit list of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://lpu-sphere-frontend-ten.vercel.app", // your production frontend
];

// ✅ Use the cors middleware properly
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ This handles preflight OPTIONS requests automatically
app.options("*", cors());

app.use(express.json());


// --- Config ---
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const MONGO_URI = process.env.MONGO_URI as string;

// --- MongoDB Connection ---
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error("🔴 MongoDB connection error:", err);
});

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connection established");
});

// --- Auth Middleware ---
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --- Routes ---
// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ ok: true, status: "Backend running" });
});

// Debug users
app.get("/api/debug/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, { _id: 0, regNo: 1, name: 1 });
    res.json({ count: users.length, users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Auth Route ---
app.post("/api/auth/login", async (req: Request, res: Response) => {
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
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Chats Route ---
app.get("/api/chats", authMiddleware, async (req: Request, res: Response) => {
  try {
    const regNo = (req as any).user.regNo;
    const classes = await ClassModel.find({
      $or: [{ members: regNo }, { faculty: regNo }],
    }).select("-__v").lean();

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
  } catch (err: any) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Messages Route ---
app.get("/api/chats/:classId/messages", authMiddleware, async (req: Request, res: Response) => {
  try {
    const regNo = (req as any).user.regNo;
    const { classId } = req.params;

    const cls = await ClassModel.findOne({ classId });
    if (!cls) return res.status(404).json({ error: "Class not found" });

    if (!cls.members.includes(regNo) && cls.faculty !== regNo) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const messages = await Message.find({ classId }).sort({ createdAt: 1 }).lean();
    res.json({ messages });
  } catch (err: any) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/chats/:classId/messages", authMiddleware, async (req: Request, res: Response) => {
  try {
    const regNo = (req as any).user.regNo;
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
  } catch (err: any) {
    console.error("Error posting message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Root Route ---
app.get("/", (req: Request, res: Response) => {
  res.send("✅ LPU Sphere Backend is live and running!");
});

// --- Export for Vercel ---
module.exports = app;

// --- Local Dev Mode ---
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
