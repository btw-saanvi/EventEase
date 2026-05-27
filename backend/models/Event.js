const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    endDate: { type: Date },
    venue: { type: String, default: "" },
    status: {
      type: String,
      enum: ["planning", "confirmed", "completed", "cancelled"],
      default: "planning",
    },
    type: {
      type: String,
      enum: ["wedding", "corporate", "birthday", "conference", "social", "other"],
      default: "other",
    },
    expectedGuests: { type: Number, default: 0 },
    coverColor: { type: String, default: "#7c3aed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
