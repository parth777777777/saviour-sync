const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load hospitals JSON
const DATA_PATH = path.join(__dirname, "..", "data", "hospitals.json");
let hospitals = [];
try {
  hospitals = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
} catch (err) {
  console.error("Failed to load hospitals.json:", err);
}

// GET all hospitals (optionally filter by blood type or organ availability)
router.get("/", (req, res) => {
  const { bloodType, minBloodQty, organType, minOrganQty } = req.query;

  const filtered = hospitals.filter((h) => {
    let pass = true;

    if (bloodType) {
      const qty = h.bloodInventory?.[bloodType];
      pass = pass && typeof qty === "number" && qty > 0 && (!minBloodQty || qty >= parseInt(minBloodQty));
    }

    if (organType) {
      const qty = h.organInventory?.[organType];
      pass = pass && typeof qty === "number" && qty > 0 && (!minOrganQty || qty >= parseInt(minOrganQty));
    }

    return pass;
  });

  res.json(filtered);
});

module.exports = router;
