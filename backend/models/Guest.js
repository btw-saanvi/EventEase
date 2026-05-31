const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    rsvp: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
    },
    dietary: { type: String, default: "" },
    table: { type: String, default: "" },
    notes: { type: String, default: "" },
    plusOne: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);
