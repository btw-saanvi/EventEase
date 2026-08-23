const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId:      { type: String, sparse: true },
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true },
    password:      { type: String, default: "" },          // bcrypt hash for email/pass users
    avatar:        { type: String, default: "" },
    phone:         { type: String, default: "" },
    location:      { type: String, default: "" },
    bio:           { type: String, default: "" },
    resetOTP:      { type: String, default: "" },
    resetOTPExpiry:{ type: Date,   default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
