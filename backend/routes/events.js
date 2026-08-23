const express = require("express");
const validator = require("validator");
const Event = require("../models/Event");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// All routes require auth
router.use(verifyToken);

// Whitelist of fields a user is allowed to set on an event
const ALLOWED_FIELDS = ["title", "date", "venue", "description", "status", "type", "expectedGuests", "budget"];

function pickAllowed(body) {
  const data = {};
  ALLOWED_FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
}

// GET /api/events — get all events for current user
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({ date: 1 });
    res.json({ events });
  } catch (err) {
    console.error("Get events error:", err.message);
    res.status(500).json({ message: "Could not fetch events." });
  }
});

// POST /api/events — create event (no mass-assignment of userId)
router.post("/", async (req, res) => {
  try {
    const data = pickAllowed(req.body);
    if (!data.title || !String(data.title).trim()) {
      return res.status(400).json({ message: "Event title is required." });
    }
    // Sanitize title & venue to prevent stored XSS
    if (data.title)       data.title       = validator.trim(String(data.title)).slice(0, 200);
    if (data.venue)       data.venue       = validator.trim(String(data.venue)).slice(0, 300);
    if (data.description) data.description = validator.trim(String(data.description)).slice(0, 2000);

    const event = await Event.create({ ...data, userId: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    console.error("Create event error:", err.message);
    res.status(400).json({ message: err.message || "Could not create event." });
  }
});

// GET /api/events/:id — only returns event owned by current user
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (err) {
    console.error("Get event error:", err.message);
    res.status(500).json({ message: "Could not fetch event." });
  }
});

// PUT /api/events/:id — update (whitelist only, userId scoped)
router.put("/:id", async (req, res) => {
  try {
    const data = pickAllowed(req.body);
    if (data.title)       data.title       = validator.trim(String(data.title)).slice(0, 200);
    if (data.venue)       data.venue       = validator.trim(String(data.venue)).slice(0, 300);
    if (data.description) data.description = validator.trim(String(data.description)).slice(0, 2000);

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      data,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (err) {
    console.error("Update event error:", err.message);
    res.status(400).json({ message: err.message || "Could not update event." });
  }
});

// DELETE /api/events/:id — only deletes event owned by current user
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ message: "Event deleted." });
  } catch (err) {
    console.error("Delete event error:", err.message);
    res.status(500).json({ message: "Could not delete event." });
  }
});

module.exports = router;
