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
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server, same-origin)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
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

// ─── MongoDB Connection Management (Serverless-Safe) ─────────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/eventease";

let cachedDb = null;
let indexesRepaired = false;

// Stale index definitions
const STALE_INDEXES = [
  {
    collection: "users",
    index: "googleId_1",
    label: "users.googleId",
    isStale: (idx) => !idx.partialFilterExpression,
  },
  {
    collection: "budgets",
    index: "eventId_1",
    label: "budgets.eventId",
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
      console.warn(`Index repair skipped for ${label}:`, err.message);
    }
  }

  try {
    await mongoose.connection.collection("users").updateMany({ googleId: null }, { $unset: { googleId: "" } });
    await Promise.all([require("./models/User").createIndexes(), require("./models/Budget").createIndexes()]);
  } catch (err) {
    console.warn("Index rebuild skipped:", err.message);
  }
};

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  const conn = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  cachedDb = conn;

  if (!indexesRepaired) {
    repairStaleIndexes().catch((err) => console.warn("Index repair warning:", err.message));
    indexesRepaired = true;
  }

  return conn;
};

// Database connection middleware for all API requests
app.use(async (req, res, next) => {
  if (req.path === "/api/health") return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(503).json({
      message: "Database connection failed. Please ensure MONGODB_URI is configured correctly in environment variables.",
    });
  }
});

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
  res.json({
    status: "ok",
    version: "1.0.0",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
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
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? status === 500
        ? "Internal Server Error"
        : err.message
      : err.message;
  res.status(status).json({ message });
});

// Start listening in standalone / local server mode
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      console.log("✅ Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
    });
}

// Export app for Vercel serverless functions
module.exports = app;