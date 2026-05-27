const express = require("express");
const Guest = require("../models/Guest");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// GET /api/guests?eventId=...
router.get("/", async (req, res) => {
  try {
    const { eventId } = req.query;
    const filter = { userId: req.user.id };
    if (eventId) filter.eventId = eventId;
    const guests = await Guest.find(filter).sort({ name: 1 });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/guests
router.post("/", async (req, res) => {
  try {
    const guest = await Guest.create({ ...req.body, userId: req.user.id });
    res.status(201).json(guest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/guests/:id
router.put("/:id", async (req, res) => {
  try {
    const guest = await Guest.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json(guest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/guests/:id
router.delete("/:id", async (req, res) => {
  try {
    const guest = await Guest.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json({ message: "Guest deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
