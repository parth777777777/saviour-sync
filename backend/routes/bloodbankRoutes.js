const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load bloodbanks JSON
const DATA_PATH = path.join(__dirname, "..", "data", "bloodbanks.json");
let bloodbanks = [];
try {
  bloodbanks = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
} catch (err) {
  console.error("Failed to load bloodbanks.json:", err);
}

// GET all bloodbanks (optionally filter by blood type and minimum quantity)
router.get("/", (req, res) => {
  const { bloodType, minQty } = req.query;

  const filtered = bloodbanks.filter((b) => {
    if (!bloodType) return true;
    const qty = b.bloodInventory?.[bloodType];
    return typeof qty === "number" && qty > 0 && (!minQty || qty >= parseInt(minQty));
  });

  res.json(filtered);
});

module.exports = router;
