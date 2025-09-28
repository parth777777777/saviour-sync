const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Signup (user role only)
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password, role: "user" });
    await user.save();

    res.status(201).json({ message: "User registered successfully", username: user.username, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Login (user or admin)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
