const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const verifyToken = require("../middleware/authMiddleware"); // JWT middleware
const fs = require("fs");
const path = require("path");

// --- Helper: Haversine distance in meters ---
function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- Load bloodbanks JSON once ---
const DATA_PATH = path.join(__dirname, "..", "data", "bloodbanks.json");
let bloodbanks = [];
try {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  bloodbanks = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load bloodbanks.json:", err);
}

// --- Create donor (protected) ---
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, location, bloodGroup, organ, locationCoords } = req.body;

    if (!name || !email || !phone || !location || !bloodGroup) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const donor = new Donor({
      name,
      email,
      phone,
      location,
      bloodGroup,
      organ: organ || null,
      locationCoords: locationCoords || null,
      createdBy: req.user.email,
    });

    const saved = await donor.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving donor:", err);
    res.status(400).json({ message: err.message });
  }
});

// --- Search donors + bloodbanks ---
router.get("/search", async (req, res) => {
  const { lat, lng, type, value } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: "Coordinates required" });

  const radiusMeters = 50 * 1000; // 500 km

  try {
    // --- Fetch donors matching type/value ---
    let donorQuery = {
      locationCoords: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusMeters,
        },
      },
    };
    if (type === "blood") donorQuery.bloodGroup = value;
    if (type === "organ") donorQuery.organ = value;

    const donors = await Donor.find(donorQuery).lean();
    const donorsWithDistance = donors.map((d) => {
      const [dLng, dLat] = d.locationCoords.coordinates;
      return {
        ...d,
        distance: haversineMeters(parseFloat(lat), parseFloat(lng), dLat, dLng),
        type: "donor",
      };
    });

    // --- Filter bloodbanks by type/value ---
    const bloodBanksFiltered = bloodbanks
      .map((b) => {
        const [bLng, bLat] = b.locationCoords.coordinates;
        return {
          ...b,
          distance: haversineMeters(parseFloat(lat), parseFloat(lng), bLat, bLng),
          type: "bloodbank",
        };
      })
      .filter((b) => b.distance <= radiusMeters)
      .filter((b) => {
        if (!value || type !== "blood") return true;
        const qty = b.bloodInventory?.[value];
        return typeof qty === "number" && qty > 0;
      });

    // --- Combine and sort: bloodbanks first, then donors by distance ---
    const combined = [...bloodBanksFiltered, ...donorsWithDistance].sort((a, b) => {
      if (a.type === "bloodbank" && b.type !== "bloodbank") return -1;
      if (b.type === "bloodbank" && a.type !== "bloodbank") return 1;
      return a.distance - b.distance;
    });

    res.json(combined);
  } catch (err) {
    console.error("Error fetching donors/bloodbanks:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Get all donors (admin) ---
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
