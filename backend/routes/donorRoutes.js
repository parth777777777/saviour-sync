const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const verifyToken = require("../middleware/authMiddleware"); // optional auth

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
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { bloodGroup, organs, locationCoords, age, weight, medicalConditions } = req.body;

    if (!locationCoords || !Array.isArray(locationCoords) || locationCoords.length !== 2) {
      return res.status(400).json({ message: "Valid location coordinates required" });
    }

    let donor = await Donor.findOne({ userId: req.user.id });
    if (donor) {
      donor.bloodGroup = bloodGroup || donor.bloodGroup;
      donor.organs = organs || donor.organs;
      donor.locationCoords = locationCoords || donor.locationCoords;
      donor.age = age || donor.age;
      donor.weight = weight || donor.weight;
      donor.medicalConditions = medicalConditions || donor.medicalConditions;
      await donor.save();
    } else {
      donor = new Donor({
        userId: req.user.id,
        bloodGroup,
        organs,
        locationCoords,
        age,
        weight,
        medicalConditions,
      });
      await donor.save();
    }

    res.json({ message: "Donor profile saved successfully", donor });
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

module.exports = router;
