const express = require("express");
const validator = require("validator");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// GET /api/profile — exclude all sensitive fields from response
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -resetOTP -resetOTPExpiry -googleId"
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: "Could not fetch profile." });
  }
});

// PUT /api/profile — update only whitelisted fields with input sanitization
router.put("/", async (req, res) => {
  try {
    const allowedFields = ["name", "phone", "location", "bio", "avatar"];
    const updates = {};

    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Sanitize and validate each field
    if (updates.name !== undefined) {
      updates.name = validator.trim(String(updates.name)).slice(0, 100);
      if (!updates.name) return res.status(400).json({ message: "Name cannot be empty." });
    }
    if (updates.phone !== undefined) {
      updates.phone = validator.trim(String(updates.phone)).slice(0, 20);
      // Strip non-numeric/non-allowed characters from phone
      if (updates.phone && !validator.isMobilePhone(updates.phone, "any", { strictMode: false })) {
        // Allow empty phone (clearing it), reject obviously invalid values
        if (updates.phone.length > 0 && !/^[+\d\s\-().]{7,20}$/.test(updates.phone)) {
          return res.status(400).json({ message: "Invalid phone number format." });
        }
      }
    }
    if (updates.location !== undefined) {
      updates.location = validator.trim(String(updates.location)).slice(0, 200);
    }
    if (updates.bio !== undefined) {
      updates.bio = validator.trim(String(updates.bio)).slice(0, 500);
    }
    if (updates.avatar !== undefined) {
      updates.avatar = validator.trim(String(updates.avatar)).slice(0, 500);
      // Only allow http/https URLs or empty string (to clear avatar)
      if (updates.avatar && !validator.isURL(updates.avatar, { protocols: ["http", "https"] })) {
        return res.status(400).json({ message: "Avatar must be a valid https URL." });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -resetOTP -resetOTPExpiry -googleId");

    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(400).json({ message: err.message || "Could not update profile." });
  }
});

module.exports = router;
