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

// ─── Body Parsing ────────────────────────────────────────────────────────────
// Review photos are uploaded as base64 data URLs (the UI allows files up to
// 2MB, which is ~2.7MB once base64-encoded), so JSON bodies need headroom or
// every review with a photo fails with 413 Payload Too Large.
app.use(express.json({ limit: "5mb" }));
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

// ─── Index Repair (one-time, idempotent) ────────────────────────────────────
// Stale indexes left behind by earlier schema versions reject legitimate writes:
//   • users.googleId_1  — was declared `unique: true`, so it also covered the
//     documents where googleId is missing. Every email+password signup failed
//     with "E11000 ... index: googleId_1 dup key: { googleId: null }".
//     models/User.js now declares a partial index; Mongoose never replaces an
//     index that already exists under the same name, so the old one must go.
//   • budgets.eventId_1 — `eventId` used to live on the budget document itself
//     with `unique: true`. It now lives on each expense, so every budget doc
//     indexes as "eventId: null" and only ONE can ever exist. That made
//     POST /api/budget/expenses and PUT /api/budget fail with E11000 for any
//     user who did not already have a budget document.
// Dropping these only removes an over-restrictive constraint; no documents are
// deleted.
const STALE_INDEXES = [
  {
    collection: "users",
    index: "googleId_1",
    label: "users.googleId",
    // Correct definition: partial (models/User.js only indexes real google ids).
    // An old non-partial unique index is stale because it also covers `null`.
    isStale: (idx) => !idx.partialFilterExpression,
  },
  {
    collection: "budgets",
    index: "eventId_1",
    label: "budgets.eventId",
    // `eventId` is no longer part of the budget schema, so any index on it is stale.
    isStale: () => true,
  },
];

const repairStaleIndexes = async () => {
  for (const { collection, index, label, isStale } of STALE_INDEXES) {
    try {
      const indexes = await mongoose.connection.collection(collection).indexes();
      const existing = indexes.find((idx) => idx.name === index);
      if (existing && isStale(existing)) {
        await mongoose.connection.collection(collection).dropIndex(index);
        console.log(`🔧 Dropped stale index ${label} (${index})`);
      }
    } catch (err) {
      // Never block startup because of a maintenance step
      console.warn(`Index repair skipped for ${label}:`, err.message);
    }
  }

  try {
    // Clear the explicit nulls so the partial unique index ignores them, then
    // let the models (re)create their current index definitions.
    await mongoose.connection.collection("users").updateMany({ googleId: null }, { $unset: { googleId: "" } });
    await Promise.all([require("./models/User").createIndexes(), require("./models/Budget").createIndexes()]);
  } catch (err) {
    console.warn("Index rebuild skipped:", err.message);
  }
};

connectDB()
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await repairStaleIndexes();
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