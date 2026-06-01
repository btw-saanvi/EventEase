const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dns = require("dns");
const User = require("../models/User");

const router = express.Router();

function checkDomainReal(domain) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn(`DNS lookup for domain ${domain} timed out. Proceeding.`);
      resolve(true); // fall back to true on timeout
    }, 3000);

    dns.resolveMx(domain, (err, mxRecords) => {
      if (!err && mxRecords && mxRecords.length > 0) {
        clearTimeout(timeout);
        return resolve(true);
      }
      dns.resolve4(domain, (err2, addresses) => {
        clearTimeout(timeout);
        if (!err2 && addresses && addresses.length > 0) {
          return resolve(true);
        }
        resolve(false);
      });
    });
  });
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: "7d" }
  );
}

function userPayload(user) {
  return {
    id:     user._id,
    name:   user.name,
    email:  user.email,
    avatar: user.avatar,
    phone:  user.phone,
    bio:    user.bio,
  };
}

// ─── Nodemailer transporter ───────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,   // Gmail App Password (not your main password)
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
              <!-- Header -->
              <tr>
                <td style="background:#FFD933;padding:24px 32px;border-bottom:3px solid #1E1E1E;">
                  <h1 style="margin:0;font-size:28px;color:#1E1E1E;letter-spacing:1px;">
                    ✦ EventEase
                  </h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h2 style="margin:0 0 12px;font-size:22px;color:#1E1E1E;">
                    Password Reset OTP
                  </h2>
                  <p style="margin:0 0 24px;color:#444;font-size:15px;line-height:1.6;">
                    Hey ${userName || "there"}! Use the OTP below to reset your EventEase password.
                    It expires in <strong>15 minutes</strong>.
                  </p>
                  <!-- OTP Box -->
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
              <!-- Footer -->
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

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email and password are required." });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters." });

  try {
    const emailParts = email.split("@");
    if (emailParts.length !== 2) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    const domain = emailParts[1].toLowerCase();
    const isDomainReal = await checkDomainReal(domain);
    if (!isDomainReal) {
      return res.status(400).json({ message: "That email is fake! Domain does not exist or cannot receive mail." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: "An account with this email already exists." });

    const hash = await bcrypt.hash(password, 12);
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
    const user = await User.create({ name, email: email.toLowerCase(), password: hash, avatar });

    const token = signToken(user);
    res.status(201).json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "Account doesn't exist. Make an account first, idiot!" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "This account is registered via Google. Use Google login!" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = signToken(user);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed." });
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond OK to prevent email enumeration
    if (!user) return res.json({ message: "If that email exists, an OTP has been sent." });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetOTP = otp;
    user.resetOTPExpiry = expiry;
    await user.save();

    let emailSent = false;
    try {
      await sendOTPEmail(user.email, otp, user.name);
      emailSent = true;
    } catch (mailErr) {
      console.warn("⚠️ SMTP Mail Send Failed. Check your EMAIL_USER/EMAIL_PASS in .env.");
      console.warn(`[DEVELOPMENT FALLBACK] Reset OTP for ${user.email} is: ${otp}`);
    }

    if (emailSent) {
      res.json({ message: "OTP sent to your registered email." });
    } else {
      res.json({
        message: "OTP generated (SMTP unconfigured). Check backend console!",
        devOtp: otp,
      });
    }
  } catch (err) {
    console.error("Forgot-password error:", err.message);
    res.status(500).json({ message: "Could not send OTP. Please try again." });
  }
});

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetOTP)
      return res.status(400).json({ message: "Invalid or expired OTP." });
    if (user.resetOTP !== otp)
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    if (user.resetOTPExpiry < new Date())
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    res.json({ verified: true, message: "OTP verified successfully." });
  } catch (err) {
    console.error("Verify-OTP error:", err.message);
    res.status(500).json({ message: "Verification failed." });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Email, OTP and new password are required." });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters." });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetOTP)
      return res.status(400).json({ message: "Invalid or expired OTP." });
    if (user.resetOTP !== otp)
      return res.status(400).json({ message: "Incorrect OTP." });
    if (user.resetOTPExpiry < new Date())
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

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
router.post("/google", async (req, res) => {
  const { googleUser } = req.body;
  if (!googleUser || !googleUser.sub)
    return res.status(400).json({ message: "Invalid Google user data." });

  try {
    const { sub: googleId, name, email, picture } = googleUser;
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        googleId,
        name,
        email: email.toLowerCase(),
        avatar: picture || "",
      });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (picture && user.avatar !== picture) user.avatar = picture;
      await user.save();
    }

    const token = signToken(user);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(500).json({ message: "Authentication failed." });
  }
});

// ─── POST /api/auth/mock ──────────────────────────────────────────────────────
router.post("/mock", async (req, res) => {
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
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const user = await User.findById(decoded.id).select("-password -resetOTP -resetOTPExpiry -googleId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
