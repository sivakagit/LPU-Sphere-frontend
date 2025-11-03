const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty"], required: true },
  classes: [{ type: String }],
  // 👇 added for profile page
  description: { type: String, default: "" },
  github_url: { type: String, default: "" },
  linkedin_url: { type: String, default: "" },
  portfolio_url: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
