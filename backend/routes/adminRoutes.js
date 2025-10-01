const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const adminMiddleware = require("../middleware/admin.js");
const logActivity = require("../middleware/activityLogger");
const User = require("../models/User");

// -----------------------
// DASHBOARD STATS
// -----------------------
router.get("/dashboard", adminMiddleware, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// GET ALL USERS (with pagination & search)
// -----------------------
router.get("/manage-users", adminMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = search
      ? { username: { $regex: search, $options: "i" } }
      : {};

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, users });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// UPDATE USER
// -----------------------
router.put(
  "/manage-users/:id",
  adminMiddleware,
  [
    body("email").optional().isEmail().withMessage("Must be a valid email"),
    body("username").optional().isLength({ min: 1 }).withMessage("Username cannot be empty"),
    body("role").optional().isIn(["user", "admin"]).withMessage("Role must be user or admin"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      logActivity("updated user", req.user.email, updatedUser.email);

      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

// -----------------------
// DELETE USER
// -----------------------
router.delete("/manage-users/:id", adminMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    logActivity("deleted user", req.user.email, deletedUser.email);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// PLACEHOLDER: Hospitals / Bloodbanks (can upgrade to full CRUD later)
// -----------------------
router.post("/manage-hospitals", adminMiddleware, (req, res) => res.json({ message: "Hospital managed" }));
router.post("/manage-bloodbanks", adminMiddleware, (req, res) => res.json({ message: "Bloodbank managed" }));

module.exports = router;
