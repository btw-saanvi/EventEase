const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// POST /api/auth/google
// Accepts Google userInfo + access_token from frontend
router.post("/google", async (req, res) => {
  const { googleUser } = req.body;

  if (!googleUser || !googleUser.sub) {
    return res.status(400).json({ message: "Invalid Google user data." });
  }

  try {
    const { sub: googleId, name, email, picture } = googleUser;

    // Upsert user in MongoDB
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({ googleId, name, email, avatar: picture || "" });
    } else {
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(500).json({ message: "Authentication failed." });
  }
});

// POST /api/auth/mock
router.post("/mock", async (req, res) => {
  try {
    const mockUser = {
      googleId: "mock-12345",
      name: "Demo Planner",
      email: "demo@eventease.com",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=DemoPlanner"
    };

    let user = await User.findOne({ googleId: mockUser.googleId });
    if (!user) {
      user = await User.create(mockUser);
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("Mock auth error:", err.message);
    res.status(500).json({ message: "Mock authentication failed." });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const user = await User.findById(decoded.id).select("-googleId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
