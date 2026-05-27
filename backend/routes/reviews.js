const express = require("express");
const Review = require("../models/Review");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// GET /api/reviews — user's own reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/vendor/:vendorId — public reviews for a vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const reviews = await Review.find({ vendorId: req.params.vendorId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, userId: req.user.id });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/reviews/:id
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
