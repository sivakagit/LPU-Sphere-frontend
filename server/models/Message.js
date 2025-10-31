const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  classId: { type: String, required: true },
  senderRegNo: { type: String, required: true },
  senderName: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
