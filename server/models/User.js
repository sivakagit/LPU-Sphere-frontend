const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student','faculty','admin'], default: 'student' },
  classes: [{ type: String }] // classId strings like "CSE122"
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
