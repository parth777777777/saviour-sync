const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const verifyToken = require("../middleware/authMiddleware"); 
const mongoose = require("mongoose");


// --- Helper: Haversine distance (optional, can keep in combined route) ---
function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// -------------------
// REGISTER OR UPDATE DONOR
// -------------------
// POST /api/donors/register
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { bloodGroup, location, locationCoords, age, weight, phone, medicalConditions } = req.body;

    // Validate required fields
    if (!locationCoords || !Array.isArray(locationCoords) || locationCoords.length !== 2) {
      return res.status(400).json({ message: "Valid location coordinates required" });
    }
    if (!location) return res.status(400).json({ message: "Location is required" });
    if (!bloodGroup) return res.status(400).json({ message: "Blood group is required" });
    if (!age || age < 18 || age > 70) return res.status(400).json({ message: "Valid age (18-70) is required" });
    if (!weight) return res.status(400).json({ message: "Weight is required" });
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ userId: req.user.id });
    if (existingDonor) {
      return res.status(400).json({ message: "Donor profile already exists" });
    }

    const donor = new Donor({
      userId: req.user.id,
      bloodGroup,
      organs: null, // keep organs null
      location,
      locationCoords: { type: "Point", coordinates: locationCoords },
      age,
      weight,
      phone,
      medicalConditions: medicalConditions || "",
      createdBy: req.user.id,
    });

    await donor.save();
    res.status(201).json({ message: "Donor profile created successfully", donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// -------------------
// SEARCH DONORS (for combined search, no pagination)
// -------------------
router.get("/", async (req, res) => {
  const { type, value } = req.query;

  try {
    const query = {};
    if (type === "blood" && value) query.bloodGroup = value;
    if (type === "organ" && value) query.organs = value;

    const donors = await Donor.find(query)
      .populate("userId", "username email")
      .lean();

    const safeDonors = donors.map((d) => ({
      _id: d._id,
      type: "donor",
      bloodGroup: d.bloodGroup,
      organs: d.organs,
      age: d.age,
      weight: d.weight,
      medicalConditions: d.medicalConditions,
      name: d.userId?.username || "Unnamed",
      email: d.userId?.email || null,
      location: d.location || "Unknown",
      locationCoords: d.locationCoords || { coordinates: [0, 0] },
      lastDonation: d.lastDonation || null,
    }));

    res.json(safeDonors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Public route
router.get("/public/:userId", async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.params.userId });
    if (!donor) return res.status(404).json({ message: "Donor data not found" });
    res.json({ donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/donors/check
router.get("/check", verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    res.json({ exists: !!donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
