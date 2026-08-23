const express = require("express");
const validator = require("validator");
const Review = require("../models/Review");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// Whitelist of fields a user may set on a review
const ALLOWED_FIELDS = ["vendorId", "vendorName", "eventId", "rating", "title", "comment", "tags"];

function pickAllowed(body) {
  const data = {};
  ALLOWED_FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
}

// GET /api/reviews — user's own reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    console.error("Get reviews error:", err.message);
    res.status(500).json({ message: "Could not fetch reviews." });
  }
});

// GET /api/reviews/vendor/:vendorId — public reviews for a vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const reviews = await Review.find({ vendorId: req.params.vendorId })
      .populate("userId", "name avatar") // only expose name and avatar, NOT email/phone
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    console.error("Get vendor reviews error:", err.message);
    res.status(500).json({ message: "Could not fetch vendor reviews." });
  }
});

// POST /api/reviews — create review (no mass assignment)
router.post("/", async (req, res) => {
  try {
    const data = pickAllowed(req.body);

    // Validate required fields
    if (!data.vendorId) return res.status(400).json({ message: "vendorId is required." });
    if (!data.rating || data.rating < 1 || data.rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5." });

    // Sanitize text fields
    if (data.comment)    data.comment    = validator.trim(String(data.comment)).slice(0, 2000);
    if (data.title)      data.title      = validator.trim(String(data.title)).slice(0, 200);
    if (data.vendorName) data.vendorName = validator.trim(String(data.vendorName)).slice(0, 200);

    const review = await Review.create({ ...data, userId: req.user.id });
    res.status(201).json(review);
  } catch (err) {
    console.error("Create review error:", err.message);
    res.status(400).json({ message: err.message || "Could not create review." });
  }
});

// PUT /api/reviews/:id — update own review only
router.put("/:id", async (req, res) => {
  try {
    const data = pickAllowed(req.body);
    // Never allow changing vendorId or userId through update
    delete data.vendorId;
    delete data.eventId;

    if (data.rating && (data.rating < 1 || data.rating > 5))
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    if (data.comment)    data.comment    = validator.trim(String(data.comment)).slice(0, 2000);
    if (data.title)      data.title      = validator.trim(String(data.title)).slice(0, 200);

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      data,
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found." });
    res.json(review);
  } catch (err) {
    console.error("Update review error:", err.message);
    res.status(400).json({ message: err.message || "Could not update review." });
  }
});

// DELETE /api/reviews/:id — only delete own reviews
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found." });
    res.json({ message: "Review deleted." });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ message: "Could not delete review." });
  }
});

module.exports = router;
