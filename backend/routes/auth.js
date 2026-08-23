const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dns = require("dns");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const User = require("../models/User");

const router = express.Router();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please wait 15 minutes and try again." },
  skipSuccessfulRequests: true, // only count failed attempts
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password reset requests. Please try again in 1 hour." },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many OTP attempts. Please request a new OTP." },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("CRITICAL: JWT_SECRET environment variable is not set.");
  }
  return secret;
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

function userPayload(user) {
  return {
    id:       user._id,
    name:     user.name,
    email:    user.email,
    avatar:   user.avatar,
    phone:    user.phone,
    location: user.location,
    bio:      user.bio,
  };
}

/** Constant-time OTP comparison to prevent timing attacks */
function safeOTPCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// ─── DNS Domain Check ─────────────────────────────────────────────────────────

function checkDomainReal(domain) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(true); // fail open on timeout
    }, 2000);

    dns.resolveMx(domain, (err, mxRecords) => {
      if (!err && mxRecords && mxRecords.length > 0) {
        clearTimeout(timeout);
        return resolve(true);
      }
      dns.resolve4(domain, (err2, addresses) => {
        clearTimeout(timeout);
        if (!err2 && addresses && addresses.length > 0) return resolve(true);
        // Fail open for common TLDs to avoid blocking legitimate users
        if ([".com", ".org", ".net", ".in", ".edu", ".io"].some((t) => domain.endsWith(t))) {
          return resolve(true);
        }
        resolve(false);
      });
    });
  });
}

// ─── Nodemailer transporter ───────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendOTPEmail(toEmail, otp, userName) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"EventEase" <${process.env.EMAIL_USER}>`,
    to:   toEmail,
    subject: "Your EventEase Password Reset OTP",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#F9F5F0;font-family:'DM Sans',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:40px 16px;">
            <table width="480" cellpadding="0" cellspacing="0"
              style="background:#fff;border:3px solid #1E1E1E;box-shadow:6px 6px 0 #1E1E1E;">
              <tr>
                <td style="background:#FFD933;padding:24px 32px;border-bottom:3px solid #1E1E1E;">
                  <h1 style="margin:0;font-size:28px;color:#1E1E1E;letter-spacing:1px;">
                    ✦ EventEase
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <h2 style="margin:0 0 12px;font-size:22px;color:#1E1E1E;">
                    Password Reset OTP
                  </h2>
                  <p style="margin:0 0 24px;color:#444;font-size:15px;line-height:1.6;">
                    Hey ${validator.escape(String(userName || "there"))}! Use the OTP below to reset your EventEase password.
                    It expires in <strong>15 minutes</strong>.
                  </p>
                  <div style="text-align:center;margin:24px 0;">
                    <div style="display:inline-block;background:#FFB0C2;border:3px solid #1E1E1E;
                      box-shadow:4px 4px 0 #1E1E1E;padding:16px 40px;">
                      <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#1E1E1E;">
                        ${otp}
                      </span>
                    </div>
                  </div>
                  <p style="margin:24px 0 0;color:#777;font-size:13px;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#F9F5F0;padding:16px 32px;border-top:3px solid #1E1E1E;">
                  <p style="margin:0;font-size:12px;color:#999;">
                    © 2025 EventEase. Plan events that wow everyone.
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post("/register", authLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email and password are required." });

  // Sanitize & validate
  const cleanName  = validator.trim(String(name)).slice(0, 100);
  const cleanEmail = validator.normalizeEmail(String(email).toLowerCase()) || "";

  if (!validator.isEmail(cleanEmail))
    return res.status(400).json({ message: "Invalid email format." });
  if (!validator.isLength(String(password), { min: 8 }))
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  if (!validator.isLength(cleanName, { min: 1, max: 100 }))
    return res.status(400).json({ message: "Name must be between 1 and 100 characters." });

  try {
    const domain = cleanEmail.split("@")[1];
    let isDomainReal = true;
    try {
      isDomainReal = await checkDomainReal(domain);
    } catch {
      // fail open on DNS errors
    }
    if (!isDomainReal) {
      return res.status(400).json({ message: "That email domain does not appear to exist." });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing)
      return res.status(409).json({ message: "An account with this email already exists." });

    const hash = await bcrypt.hash(password, 12);
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`;
    const user = await User.create({ name: cleanName, email: cleanEmail, password: hash, avatar });

    const token = signToken(user);
    res.status(201).json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  const cleanEmail = String(email).toLowerCase().trim();

  try {
    const user = await User.findOne({ email: cleanEmail });

    // Use generic error to prevent account enumeration
    if (!user || !user.password) {
      // Still run bcrypt to prevent timing-based enumeration
      await bcrypt.compare(password, "$2b$12$invalidhashpadding00000000000000000000000000000000000");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = signToken(user);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const cleanEmail = String(email).toLowerCase().trim();

  try {
    const user = await User.findOne({ email: cleanEmail });
    // Always respond OK to prevent email enumeration
    if (!user) return res.json({ message: "If that email exists, an OTP has been sent." });

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetOTP = otp;
    user.resetOTPExpiry = expiry;
    user.otpAttempts = 0; // reset attempt counter
    await user.save();

    try {
      await sendOTPEmail(user.email, otp, user.name);
    } catch (mailErr) {
      console.warn("⚠️ SMTP Mail Send Failed:", mailErr.message);
      // In development only — log OTP to console, never expose in response
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[DEV ONLY] Reset OTP for ${user.email}: ${otp}`);
      }
    }

    // Never expose the OTP in the response, even in development
    res.json({ message: "If that email exists, an OTP has been sent." });
  } catch (err) {
    console.error("Forgot-password error:", err.message);
    res.status(500).json({ message: "Could not process request. Please try again." });
  }
});

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
router.post("/verify-otp", otpLimiter, async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  const cleanEmail = String(email).toLowerCase().trim();
  const cleanOtp   = String(otp).trim();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user || !user.resetOTP)
      return res.status(400).json({ message: "Invalid or expired OTP." });
    if (user.resetOTPExpiry < new Date())
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    // Constant-time comparison to prevent timing attacks
    if (!safeOTPCompare(user.resetOTP, cleanOtp))
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });

    res.json({ verified: true, message: "OTP verified successfully." });
  } catch (err) {
    console.error("Verify-OTP error:", err.message);
    res.status(500).json({ message: "Verification failed." });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post("/reset-password", otpLimiter, async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Email, OTP and new password are required." });
  if (!validator.isLength(String(newPassword), { min: 8 }))
    return res.status(400).json({ message: "Password must be at least 8 characters." });

  const cleanEmail = String(email).toLowerCase().trim();
  const cleanOtp   = String(otp).trim();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user || !user.resetOTP)
      return res.status(400).json({ message: "Invalid or expired OTP." });
    if (user.resetOTPExpiry < new Date())
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    if (!safeOTPCompare(user.resetOTP, cleanOtp))
      return res.status(400).json({ message: "Incorrect OTP." });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOTP = "";
    user.resetOTPExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset-password error:", err.message);
    res.status(500).json({ message: "Password reset failed." });
  }
});

// ─── POST /api/auth/google ────────────────────────────────────────────────────
router.post("/google", authLimiter, async (req, res) => {
  const { googleUser } = req.body;

  // Basic validation — in production you'd verify the Google ID token server-side
  // using google-auth-library. For now we validate shape and sanitize.
  if (
    !googleUser ||
    typeof googleUser.sub !== "string" ||
    typeof googleUser.email !== "string" ||
    !validator.isEmail(googleUser.email)
  ) {
    return res.status(400).json({ message: "Invalid Google user data." });
  }

  try {
    const { sub: googleId, name, email, picture } = googleUser;
    const cleanEmail = validator.normalizeEmail(email.toLowerCase()) || email.toLowerCase();
    const cleanName  = validator.trim(String(name || "User")).slice(0, 100);

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      user = await User.create({
        googleId,
        name:   cleanName,
        email:  cleanEmail,
        avatar: typeof picture === "string" && validator.isURL(picture) ? picture : "",
      });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (picture && typeof picture === "string" && validator.isURL(picture) && user.avatar !== picture)
        user.avatar = picture;
      await user.save();
    }

    const token = signToken(user);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("Google auth error:", err.message);
    res.status(500).json({ message: "Authentication failed." });
  }
});

// ─── POST /api/auth/mock ──────────────────────────────────────────────────────
// Disabled in production — only for local dev/demo
router.post("/mock", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not found." });
  }
  try {
    const mockData = {
      name:   "Demo Planner",
      email:  "demo@eventease.com",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=DemoPlanner",
    };
    let user = await User.findOne({ email: mockData.email });
    if (!user) user = await User.create(mockData);

    const token = signToken(user);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("Mock auth error:", err.message);
    res.status(500).json({ message: "Mock authentication failed." });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  const token = (req.headers["authorization"] || "").split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided." });
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select(
      "-password -resetOTP -resetOTPExpiry -googleId"
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
});

module.exports = router;
