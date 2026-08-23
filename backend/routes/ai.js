const express = require("express");
const axios = require("axios");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// ─── Rate Limit: AI endpoints are expensive, limit to 20 req/hour per user ───
// NOTE: keyGenerator runs after verifyToken, so req.user is available
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  keyGenerator: (req, res) => {
    // Prefer authenticated user ID (after verifyToken); fall back to normalized IP
    if (req.user && req.user.id) return String(req.user.id);
    return ipKeyGenerator(req, res); // handles IPv6 normalization correctly
  },
  skip: () => false,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "You've reached the AI request limit. Please try again in 1 hour." },
});

// ─── All AI routes require authentication ─────────────────────────────────────
router.use(verifyToken);
router.use(aiLimiter);

// ─── Grok API helper ──────────────────────────────────────────────────────────
async function callGrokAPI(messages, temperature = 0.7) {
  const apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }

  try {
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-beta",
        messages,
        temperature,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        timeout: 15000, // 15-second timeout to prevent hanging requests
      }
    );

    if (response.data?.choices?.[0]) {
      return response.data.choices[0].message.content.trim();
    }
  } catch (err) {
    // Log to server but never expose API error details to client
    console.warn("Grok API Error:", err.response?.status || err.message);
  }
  return null;
}

// ─── POST /api/ai/calculate-quotation ────────────────────────────────────────
router.post("/calculate-quotation", async (req, res) => {
  try {
    const {
      name, eventType, guests, budgetAmount, experienceLevel,
      services, eventTime, location, dietary, details
    } = req.body;

    // Validate & sanitize numeric inputs
    const budget     = parseFloat(budgetAmount);
    const guestCount = parseInt(guests, 10);

    const missingData = [];
    if (!budgetAmount || isNaN(budget) || budget <= 0) missingData.push("Budget amount");
    if (!guests || isNaN(guestCount) || guestCount <= 0) missingData.push("Expected guest count");
    if (!eventType) missingData.push("Event type");

    if (missingData.length > 0) {
      return res.status(400).json({
        message: `Hoot! Easey the Owl needs a little more data: ${missingData.join(", ")}.`,
        missingFields: missingData,
      });
    }

    // Sanity bounds to prevent abuse
    if (budget > 100_000_000) return res.status(400).json({ message: "Budget value is too large." });
    if (guestCount > 100_000)  return res.status(400).json({ message: "Guest count is too large." });

    // Budget allocation logic
    let cateringPct   = 0.40;
    let decorPct      = 0.25;
    let venuePct      = 0.15;
    let photoMusicPct = 0.15;
    let bufferPct     = 0.05;

    if (experienceLevel === "budget") {
      cateringPct = 0.50; decorPct = 0.20; venuePct = 0.10; photoMusicPct = 0.10; bufferPct = 0.10;
    } else if (experienceLevel === "premium") {
      cateringPct = 0.35; decorPct = 0.30; venuePct = 0.15; photoMusicPct = 0.15; bufferPct = 0.05;
    }

    const catering   = Math.round(budget * cateringPct);
    const decor      = Math.round(budget * decorPct);
    const venue      = Math.round(budget * venuePct);
    const photoMusic = Math.round(budget * photoMusicPct);
    const buffer     = Math.round(budget * bufferPct);
    const perGuest   = Math.round(budget / guestCount);

    // Safe fallback recommendation (no user input interpolated without sanitization)
    let aiRecommendation = `For a ${String(eventType).slice(0, 50)} with ${guestCount} guests, focus spending on live food counters & playlist setup!`;

    // Build Grok prompt — user-supplied strings are included in user message role only
    const grokPrompt = [
      {
        role: "system",
        content: `You are Easey the Owl, the cute brutalist mascot for EventEase. You specialize in small to medium scale party planning (house parties, casual family BBQs, micro-weddings).
Your goal is to inspect all relevant parameters and provide 2 witty, highly specific, and actionable sentences guiding the host. Always maintain a warm, playful tone.`,
      },
      {
        role: "user",
        content: [
          `Host Name: ${String(name || "Planner").slice(0, 100)}`,
          `Event Type: ${String(eventType).slice(0, 100)}`,
          `Guest Count: ${guestCount}`,
          `Total Budget: ₹${budget}`,
          `Experience Level: ${String(experienceLevel || "standard").slice(0, 50)}`,
          `Location: ${String(location || "Not specified").slice(0, 100)}`,
          `Event Timing: ${String(eventTime || "Evening").slice(0, 50)}`,
          `Dietary Notes: ${String(dietary || "Standard").slice(0, 200)}`,
          `Services Selected: ${Array.isArray(services) ? services.map((s) => String(s).slice(0, 50)).join(", ") : "Catering, Decor"}`,
          `Special Notes: ${String(details || "None").slice(0, 500)}`,
          ``,
          `Generate 2 cute, expert planning tips.`,
        ].join("\n"),
      },
    ];

    const grokResult = await callGrokAPI(grokPrompt);
    if (grokResult) {
      aiRecommendation = grokResult;
    }

    res.json({
      success: true,
      provider: grokResult ? "grok" : "easey-owl-smart",
      mascot: "Easey the Owl",
      total: budget,
      perGuest,
      breakdown: [
        { category: "Food & Drinks (Catering)",  amount: catering,   pct: Math.round(cateringPct   * 100) },
        { category: "Ambience & Decor",           amount: decor,      pct: Math.round(decorPct      * 100) },
        { category: "Venue & Sound Setup",        amount: venue,      pct: Math.round(venuePct      * 100) },
        { category: "Photo / Music / Extras",     amount: photoMusic, pct: Math.round(photoMusicPct * 100) },
        { category: "Emergency Buffer",           amount: buffer,     pct: Math.round(bufferPct     * 100) },
      ],
      tip: aiRecommendation,
    });
  } catch (err) {
    console.error("AI quotation error:", err.message);
    res.status(500).json({ message: "Failed to calculate AI quotation." });
  }
});

module.exports = router;
