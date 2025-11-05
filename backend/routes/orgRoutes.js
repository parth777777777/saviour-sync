const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Campaign = require("../models/Campaign");
const Donor = require("../models/Donor")
// JWT secret (move to .env in production)
const JWT_SECRET = process.env.JWT_SECRET

// Load data
const bloodbanksPath = path.join(__dirname, "../data/bloodbanks.json");
let bloodbanks = require("../data/bloodbanks.json");
const hospitalsPath = path.join(__dirname, "../data/hospitals.json");
let hospitals = require("../data/hospitals.json");


// Middleware to protect org routes
function verifyOrgToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // <-- use index 1!
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.org = decoded; // attach org info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Signup route for orgs
router.post(
  "/signup",
  [
    body("orgId").notEmpty().withMessage("Organization ID is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Organization name is required"),
    body("type")
      .isIn(["bloodbank", "hospital"])
      .withMessage("Type must be 'bloodbank' or 'hospital'"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { orgId, password, name, type, location } = req.body;

      // Pick the right JSON file
      let orgArray = type === "bloodbank" ? bloodbanks : hospitals;
      let orgFile = type === "bloodbank" ? bloodbanksPath : hospitalsPath;

      // Check if already exists
      const existingOrg = orgArray.find((org) => org.orgId === orgId);
      if (existingOrg)
        return res.status(400).json({ message: "Organization already registered" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new org
      const newOrg = {
        orgId,
        name,
        password: hashedPassword,
        location: location || "",
        type,           // use 'type' instead of 'role' for consistency
        campaigns: [],
      };

      // Save to JSON
      orgArray.push(newOrg);
      fs.writeFileSync(orgFile, JSON.stringify(orgArray, null, 2));

      res.status(201).json({ message: "Organization registered successfully", orgId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login route with JWT
router.post(
  "/login",
  [
    body("orgId").notEmpty().withMessage("Organization ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { orgId, password } = req.body;

    const org =
      bloodbanks.find((o) => o.orgId === orgId) ||
      hospitals.find((o) => o.orgId === orgId);

    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    // Compare plain password with hashed one
    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { orgId: org.orgId, type: org.type },
      JWT_SECRET,
      { expiresIn: "6h" } // adjust token lifetime as needed
    );

    return res.status(200).json({
      message: "Login successful",
      orgId: org.orgId,
      type: org.type,
      token,
    });
  }
);

router.get("/campaigns", verifyOrgToken, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ orgId: req.org.orgId });
    res.status(200).json({ campaigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/campaigns/:id", verifyOrgToken, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      orgId: req.org.orgId,
    });

    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    res.status(200).json({ campaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post(
  "/campaigns/create",
  verifyOrgToken,
  [
    body("name").notEmpty().withMessage("Campaign name is required"),
    body("startDate").isISO8601().withMessage("Start date is required"),
    body("endDate").isISO8601().withMessage("End date is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("locationCoords.coordinates")
      .isArray({ min: 2, max: 2 })
      .withMessage("Coordinates must be [longitude, latitude]"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, startDate, endDate, location, locationCoords } = req.body;

    try {
      const campaign = await Campaign.create({
        orgId: req.org.orgId,
        name,
        startDate,
        endDate,
        location,
        locationCoords,
        registeredUsers: [],
      });

      res.status(201).json({ message: "Campaign created", campaign });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Mark a user as donated and update donor history
// Mark a donor as donated
router.post("/campaigns/:campaignId/mark-donated", verifyOrgToken, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { userId, amount, type, location } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // Find the user in registeredUsers
    const regUser = campaign.registeredUsers.find(u => u.userId === userId);
    if (!regUser) return res.status(404).json({ message: "User not registered in campaign" });

    regUser.donated = true;
    regUser.amount = amount;

    await campaign.save();

    // Update Donor's donation history
    const donor = await Donor.findOne({ userId });
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    donor.donationHistory.push({
      type: type || "Blood",
      date: new Date(),
      location: location || campaign.location,
      volume: amount || null,
    });
    donor.lastDonation = new Date();
    await donor.save();

    res.status(200).json({ message: "Donation marked successfully", campaign, donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router
module.exports.verifyOrgToken = verifyOrgToken; 
