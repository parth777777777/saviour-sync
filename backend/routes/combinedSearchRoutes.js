const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const fs = require("fs");
const path = require("path");

// Helper: Haversine distance in meters
function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Load bloodbanks JSON
const bloodbanksPath = path.join(__dirname, "..", "data", "bloodbanks.json");
let bloodbanks = [];
try {
  const raw = fs.readFileSync(bloodbanksPath, "utf8");
  bloodbanks = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load bloodbanks.json:", err);
}

// Load hospitals JSON
const hospitalsPath = path.join(__dirname, "..", "data", "hospitals.json");
let hospitals = [];
try {
  const raw = fs.readFileSync(hospitalsPath, "utf8");
  hospitals = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load hospitals.json:", err);
}

// --- Search donors + bloodbanks + hospitals ---
router.get("/", async (req, res) => {
  const { lat, lng, type, value } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: "Coordinates required" });

  const radiusMeters = 250 * 1000; // 500 km

  try {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    // --- Donors ---
    let donorQuery = {
      locationCoords: {
        $near: {
          $geometry: { type: "Point", coordinates: [parsedLng, parsedLat] },
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
        distance: haversineMeters(parsedLat, parsedLng, dLat, dLng),
        type: "donor",
      };
    });

    // --- Bloodbanks ---
    const bloodbanksFiltered = bloodbanks
      .map((b) => {
        const [bLng, bLat] = b.locationCoords.coordinates;
        return {
          ...b,
          distance: haversineMeters(parsedLat, parsedLng, bLat, bLng),
          type: "bloodbank",
        };
      })
      .filter((b) => b.distance <= radiusMeters)
      .filter((b) => {
        if (!value || type !== "blood") return true;
        const qty = b.bloodInventory?.[value];
        return typeof qty === "number" && qty > 0;
      });

    // --- Hospitals ---
    const hospitalsFiltered = hospitals
      .map((h) => {
        const [hLng, hLat] = h.locationCoords.coordinates;
        return {
          ...h,
          distance: haversineMeters(parsedLat, parsedLng, hLat, hLng),
          type: "hospital",
        };
      })
      .filter((h) => h.distance <= radiusMeters)
      .filter((h) => {
        if (!value) return true;
        if (type === "blood") {
          const qty = h.bloodInventory?.[value];
          return typeof qty === "number" && qty > 0;
        }
        if (type === "organ") {
          const qty = h.organInventory?.[value];
          return typeof qty === "number" && qty > 0;
        }
        return true;
      });

    // --- Combine and sort ---
    const combined = [...bloodbanksFiltered, ...hospitalsFiltered, ...donorsWithDistance].sort(
      (a, b) => {
        const priority = { bloodbank: 1, hospital: 2, donor: 3 };
        if (priority[a.type] !== priority[b.type]) return priority[a.type] - priority[b.type];
        return a.distance - b.distance;
      }
    );

    res.json(combined);
  } catch (err) {
    console.error("Error in combined search:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
