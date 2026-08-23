const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing!");
    return res.status(500).json({ message: "Server authentication misconfiguration." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyToken };
