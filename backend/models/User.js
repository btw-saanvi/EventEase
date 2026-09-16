const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Optional: only Google sign-ins have one. It must stay unique when present,
    // so this uses a partial unique index (declared below) rather than
    // `unique: true`. A plain unique index also indexes documents where the
    // field is missing/null, which made every new email+password signup fail
    // with E11000 duplicate key error on { googleId: null }.
    googleId:      { type: String, default: undefined },
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

// Unique only for documents that actually carry a googleId string.
// Documents without one (email/password users) are not indexed at all.
userSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: { googleId: { $type: "string" } },
    name: "googleId_1",
  }
);

module.exports = mongoose.model("User", userSchema);
