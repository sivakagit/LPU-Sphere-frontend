// socket/socket.js
const Message = require("../../../server/models/Message");
const ClassModel = require("../../../server/models/Class");

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // User joins a specific class room
    socket.on("joinRoom", async (classId) => {
      socket.join(classId);
      console.log(`👥 User joined room: ${classId}`);
    });

    // User sends a message
    socket.on("sendMessage", async (data) => {
      try {
        const { classId, regNo, name, text } = data;

        if (!text?.trim()) return;

        const cls = await ClassModel.findOne({ classId });
        if (!cls) {
          console.log("⚠️ Class not found:", classId);
          return;
        }

        const message = new Message({
          classId,
          senderRegNo: regNo,
          senderName: name,
          text,
          createdAt: new Date(),
        });

        await message.save();

        // Broadcast to everyone in the same class room
        io.to(classId).emit("newMessage", message);
        console.log(`💬 Message sent in ${classId} by ${name}`);
      } catch (err) {
        console.error("🔥 Socket message error:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
}

module.exports = initializeSocket;
