const express = require("express");
const validator = require("validator");
const Guest = require("../models/Guest");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// Whitelist of fields a user may set on a guest
const ALLOWED_FIELDS = ["eventId", "name", "email", "phone", "rsvp", "dietaryRestrictions", "plusOne", "notes", "table", "group"];

function pickAllowed(body) {
  const data = {};
  ALLOWED_FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
}

// GET /api/guests?eventId=...
router.get("/", async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.eventId) filter.eventId = String(req.query.eventId).slice(0, 100);
    const guests = await Guest.find(filter).sort({ name: 1 });
    res.json({ guests });
  } catch (err) {
    console.error("Get guests error:", err.message);
    res.status(500).json({ message: "Could not fetch guests." });
  }
});

// POST /api/guests — create guest (no mass assignment)
router.post("/", async (req, res) => {
  try {
    const data = pickAllowed(req.body);

    if (!data.name || !validator.trim(String(data.name)))
      return res.status(400).json({ message: "Guest name is required." });

    // Sanitize inputs
    data.name  = validator.trim(String(data.name)).slice(0, 200);
    if (data.email) {
      if (!validator.isEmail(String(data.email)))
        return res.status(400).json({ message: "Invalid guest email format." });
      data.email = String(data.email).toLowerCase().trim();
    }
    if (data.phone) data.phone = validator.trim(String(data.phone)).slice(0, 20);
    if (data.notes) data.notes = validator.trim(String(data.notes)).slice(0, 500);
    if (data.dietaryRestrictions)
      data.dietaryRestrictions = validator.trim(String(data.dietaryRestrictions)).slice(0, 200);

    const guest = await Guest.create({ ...data, userId: req.user.id });
    res.status(201).json(guest);
  } catch (err) {
    console.error("Create guest error:", err.message);
    res.status(400).json({ message: err.message || "Could not add guest." });
  }
});

// PUT /api/guests/:id — update guest (whitelist only, scoped to user)
router.put("/:id", async (req, res) => {
  try {
    const data = pickAllowed(req.body);
    // Never allow changing userId or eventId
    delete data.eventId;

    if (data.name)  data.name  = validator.trim(String(data.name)).slice(0, 200);
    if (data.email) {
      if (!validator.isEmail(String(data.email)))
        return res.status(400).json({ message: "Invalid guest email format." });
      data.email = String(data.email).toLowerCase().trim();
    }
    if (data.phone) data.phone = validator.trim(String(data.phone)).slice(0, 20);
    if (data.notes) data.notes = validator.trim(String(data.notes)).slice(0, 500);

    const guest = await Guest.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      data,
      { new: true, runValidators: true }
    );
    if (!guest) return res.status(404).json({ message: "Guest not found." });
    res.json(guest);
  } catch (err) {
    console.error("Update guest error:", err.message);
    res.status(400).json({ message: err.message || "Could not update guest." });
  }
});

// DELETE /api/guests/:id — scoped to user's own guests
router.delete("/:id", async (req, res) => {
  try {
    const guest = await Guest.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!guest) return res.status(404).json({ message: "Guest not found." });
    res.json({ message: "Guest deleted." });
  } catch (err) {
    console.error("Delete guest error:", err.message);
    res.status(500).json({ message: "Could not delete guest." });
  }
});

module.exports = router;
