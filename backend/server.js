const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ override: true });

const app = express();

// ─── Middleware ─────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ─────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const guestRoutes = require("./routes/guests");
const budgetRoutes = require("./routes/budget");
const vendorRoutes = require("./routes/vendors");
const reviewRoutes = require("./routes/reviews");
const profileRoutes = require("./routes/profile");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/profile", profileRoutes);

// ─── Health Check ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "EventEase API is running", version: "1.0.0" });
});

// ─── Error Handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ─── MongoDB + Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/eventease";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });