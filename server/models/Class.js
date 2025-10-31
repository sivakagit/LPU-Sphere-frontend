// models/Class.js
const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  classId: { 
    type: String, 
    required: true, 
    unique: true 
  }, // e.g., "CSE3A"
  className: { 
    type: String, 
    required: true 
  }, // e.g., "CSE Year 3"
  code: String, // Optional: e.g., "K22GE-CSE-122"
  faculty: { 
    type: String, 
    required: true 
  }, // Faculty regNo
  members: [{ 
    type: String 
  }], // Array of student regNos
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Class', ClassSchema);