const express = require("express");
const axios = require("axios");

const router = express.Router();

// Helper function to call Grok API (xAI API)
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
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content.trim();
    }
  } catch (err) {
    console.warn("Grok API Error:", err.response?.data || err.message);
  }
  return null;
}

// POST /api/ai/calculate-quotation - Calculate AI budget breakdown and Grok planning tips
router.post("/calculate-quotation", async (req, res) => {
  try {
    const { name, eventType, guests, budgetAmount, experienceLevel, services, eventTime, location, dietary, details } = req.body;

    const budget = parseFloat(budgetAmount) || 30000;
    const guestCount = parseInt(guests) || 25;

    // Check if relevant data is provided; if crucial fields are missing, return missing data prompt guidance
    const missingData = [];
    if (!budgetAmount || budget <= 0) missingData.push("Budget amount");
    if (!guests || guestCount <= 0) missingData.push("Expected guest count");
    if (!eventType) missingData.push("Event type (House party, Casual family, etc.)");

    if (missingData.length > 0) {
      return res.status(400).json({
        message: `Hoot! Easey the Owl needs a little more data before calculating your exact math: ${missingData.join(", ")}.`,
        missingFields: missingData,
      });
    }

    let cateringPct = 0.40;
    let decorPct = 0.25;
    let venuePct = 0.15;
    let photoMusicPct = 0.15;
    let bufferPct = 0.05;

    if (experienceLevel === "budget") {
      cateringPct = 0.50; decorPct = 0.20; venuePct = 0.10; photoMusicPct = 0.10; bufferPct = 0.10;
    } else if (experienceLevel === "premium") {
      cateringPct = 0.35; decorPct = 0.30; venuePct = 0.15; photoMusicPct = 0.15; bufferPct = 0.05;
    }

    const catering = Math.round(budget * cateringPct);
    const decor = Math.round(budget * decorPct);
    const venue = Math.round(budget * venuePct);
    const photoMusic = Math.round(budget * photoMusicPct);
    const buffer = Math.round(budget * bufferPct);
    const perGuest = Math.round(budget / guestCount);

    let aiRecommendation = `For a ${eventType || "party"} with ${guestCount} guests in ${location || "your venue"}, focus spending on live food counters & playlist setup!`;

    // System prompt instructing Grok to act as Easey the Mascot and evaluate all relevant party parameters
    const grokPrompt = [
      {
        role: "system",
        content: `You are Easey the Owl, the cute brutalist mascot for EventEase. You specialize in small to medium scale party planning (house parties, casual family BBQs, micro-weddings).
Your goal is to inspect all relevant parameters (Guest Count, Budget, Location, Timing, Dietary Needs, Experience Level, Selected Services) and provide 2 witty, highly specific, and actionable sentences guiding the host. Always maintain a warm, playful tone.`,
      },
      {
        role: "user",
        content: `Host Name: ${name || "Planner"}
Event Type: ${eventType}
Guest Count: ${guestCount}
Total Budget: ₹${budget}
Experience Level: ${experienceLevel}
Location: ${location || "Not specified"}
Event Timing: ${eventTime || "Evening"}
Dietary Notes: ${dietary || "Standard"}
Services Selected: ${services?.join(", ") || "Catering, Decor"}
Special Notes: ${details || "None"}

Generate 2 cute, expert planning tips.`,
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
        { category: "Food & Drinks (Catering)", amount: catering, pct: Math.round(cateringPct * 100) },
        { category: "Ambience & Decor", amount: decor, pct: Math.round(decorPct * 100) },
        { category: "Venue & Sound Setup", amount: venue, pct: Math.round(venuePct * 100) },
        { category: "Photo / Music / Extras", amount: photoMusic, pct: Math.round(photoMusicPct * 100) },
        { category: "Emergency Buffer", amount: buffer, pct: Math.round(bufferPct * 100) },
      ],
      tip: aiRecommendation,
    });
  } catch (err) {
    console.error("Grok AI quotation calculation error:", err);
    res.status(500).json({ message: "Failed to calculate AI quotation" });
  }
});

module.exports = router;
