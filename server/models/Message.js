const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true },
    senderRegNo: { type: String, required: true },
    senderName: { type: String },
    text: { type: String, required: true },

    // 👁️ Track which users have read the message
    readBy: [{ type: String }], // List of regNos who have read the message
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Message", MessageSchema);
