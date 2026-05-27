const mongoose = require("mongoose");

const savedVendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    vendorId: { type: String, required: true },
    vendorName: { type: String, default: "" },
    vendorCategory: { type: String, default: "" },
    status: {
      type: String,
      enum: ["saved", "contacted", "booked", "declined"],
      default: "saved",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

savedVendorSchema.index({ userId: 1, vendorId: 1 }, { unique: true });

module.exports = mongoose.model("SavedVendor", savedVendorSchema);
