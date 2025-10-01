const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const logActivity = require("../middlewares/activityLogger");

// -----------------------
// Rate limiter for login
// -----------------------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts
  message: "Too many login attempts, please try again later",
});

// -----------------------
// SIGNUP (user role only)
// -----------------------
router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already registered" });

      const user = new User({ username, email, password, role: "user" });
      await user.save();

      logActivity("signup", email, "self"); // optional logging

      res.status(201).json({ message: "User registered successfully", username: user.username, email: user.email });
    } catch (err) {
      next(err);
    }
  }
);

// -----------------------
// LOGIN (user or admin)
// -----------------------
router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
      });

      logActivity("login", email, "self"); // optional logging

      res.json({ token, role: user.role, email: user.email });
    } catch (err) {
      next(err);
    }
  }
);


// -----------------------
// Forgot Password
// -----------------------
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const token = crypto.randomBytes(20).toString("hex");

    // Set token and expiry (1 hour)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Construct reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// -----------------------
// Reset Password
// -----------------------
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password; // will be hashed automatically by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
