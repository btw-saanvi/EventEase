const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: String },
    vendorName: { type: String, required: true },
    vendorCategory: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    // title is optional in the UI (the ReviewModal treats it as a nice-to-have),
    // so it must not be required here or every review without one fails to save.
    title: { type: String, default: "", maxlength: 120 },
    body: { type: String, required: true, maxlength: 1000 },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
