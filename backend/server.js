const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

dotenv.config({ override: true });

const app = express();

// ─── Security Headers (helmet) ───────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // In non-production, allow all for development convenience
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      // Block unknown origins in production
      return callback(new Error(`CORS: origin '${origin}' not allowed`), false);
    },
    credentials: true,
  })
);

// ─── Body Parsing (reduced limit to prevent DoS) ─────────────────────────────
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ─── Routes ─────────────────────────────────────────────────────────────────
const authRoutes    = require("./routes/auth");
const eventRoutes   = require("./routes/events");
const guestRoutes   = require("./routes/guests");
const budgetRoutes  = require("./routes/budget");
const vendorRoutes  = require("./routes/vendors");
const reviewRoutes  = require("./routes/reviews");
const profileRoutes = require("./routes/profile");
const aiRoutes      = require("./routes/ai");

app.use("/api/auth",    authRoutes);
app.use("/api/events",  eventRoutes);
app.use("/api/guests",  guestRoutes);
app.use("/api/budget",  budgetRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai",      aiRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0" });
});

// Serve built frontend when running backend locally in production mode
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// ─── Global Error Handler (no stack traces to client) ────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  // Never expose stack traces or internal details in production
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? status === 500
        ? "Internal Server Error"
        : err.message
      : err.message;
  res.status(status).json({ message });
});

// ─── MongoDB + Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/eventease";

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) return cachedDb;
  const conn = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  cachedDb = conn;
  return conn;
};

connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Export app for Vercel serverless functions
module.exports = app;