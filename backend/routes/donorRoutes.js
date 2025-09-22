const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");

// POST /api/donors/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, location, bloodGroup, organ } = req.body;

    if (!name || !email || !phone || !location || !bloodGroup) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: "Donor with this email already exists" });
    }

    const donor = new Donor({
      name,
      email,
      phone,
      location,
      bloodGroup,
      organ: organ || null
    });

    await donor.save();
    res.status(201).json({ message: "Donor registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/donors/search
router.get("/search", async (req, res) => {
  try {
    const { location, type, value } = req.query;

    if (!location || !type || !value) {
      return res.status(400).json({ message: "Missing query parameters" });
    }

    // Build filter dynamically
    const filter = { location };
    if (type === "blood") filter.bloodGroup = value;
    else if (type === "organ") filter.organ = value;

    const donors = await Donor.find(filter);
    res.json(donors);
  } catch (err) {
    console.error(err); // check console for exact error
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
