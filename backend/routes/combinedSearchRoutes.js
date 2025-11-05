const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const fs = require("fs");
const path = require("path");

// --- Helper: Haversine distance in meters ---
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

// --- Safe JSON loader ---
function safeLoadJSON(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(data)) return [];
    // Filter out any entries missing coordinates or having invalid structure
    return data.filter((obj) => {
      try {
        const coords = obj?.locationCoords?.coordinates;
        return (
          obj &&
          coords &&
          Array.isArray(coords) &&
          coords.length === 2 &&
          typeof coords[0] === "number" &&
          typeof coords[1] === "number" &&
          !isNaN(coords[0]) &&
          !isNaN(coords[1])
        );
      } catch {
        return false;
      }
    });
  } catch (err) {
    console.error(`Failed to load or parse ${filePath}:`, err);
    return [];
  }
}

// --- Load data safely ---
const bloodbanksPath = path.join(__dirname, "..", "data", "bloodbanks.json");
const hospitalsPath = path.join(__dirname, "..", "data", "hospitals.json");

let bloodbanks = safeLoadJSON(bloodbanksPath);
let hospitals = safeLoadJSON(hospitalsPath);

// --- Combined search ---
router.get("/", async (req, res) => {
  const { lat, lng, type, value } = req.query;
  if (!lat || !lng)
    return res.status(400).json({ message: "Coordinates required" });

  const radiusMeters = 50 * 1000; // 50 km
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  try {
    // --- Donors ---
    const donorQuery = {
      locationCoords: {
        $near: {
          $geometry: { type: "Point", coordinates: [parsedLng, parsedLat] },
          $maxDistance: radiusMeters,
        },
      },
    };
    if (type === "blood") donorQuery.bloodGroup = value;
    if (type === "organ") donorQuery.organs = value;

    const donors = await Donor.find(donorQuery)
      .populate("userId", "username email")
      .lean();

    const donorsWithDistance = donors.map((d) => {
      const [dLng, dLat] = d.locationCoords.coordinates;
      return {
        ...d,
        distance: haversineMeters(parsedLat, parsedLng, dLat, dLng),
        type: "donor",
        name: d.userId?.username || null,
        email: d.userId?.email || null,
      };
    });

    // --- Bloodbanks (ignore malformed entries) ---
    const bloodbanksFiltered = bloodbanks
      .filter(
        (b) =>
          b?.locationCoords?.coordinates &&
          Array.isArray(b.locationCoords.coordinates) &&
          b.locationCoords.coordinates.length === 2
      )
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

    // --- Hospitals (ignore malformed entries) ---
    const hospitalsFiltered = hospitals
      .filter(
        (h) =>
          h?.locationCoords?.coordinates &&
          Array.isArray(h.locationCoords.coordinates) &&
          h.locationCoords.coordinates.length === 2
      )
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
        if (type === "blood")
          return (
            typeof h.bloodInventory?.[value] === "number" &&
            h.bloodInventory[value] > 0
          );
        if (type === "organ")
          return (
            typeof h.organInventory?.[value] === "number" &&
            h.organInventory[value] > 0
          );
        return true;
      });

    // --- Combine & sort ---
    const combined = [
      ...bloodbanksFiltered,
      ...hospitalsFiltered,
      ...donorsWithDistance,
    ].sort((a, b) => {
      const priority = { bloodbank: 1, hospital: 2, donor: 3 };
      if (priority[a.type] !== priority[b.type])
        return priority[a.type] - priority[b.type];
      return a.distance - b.distance;
    });

    res.json(combined);
  } catch (err) {
    console.error("Error in combined search:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
