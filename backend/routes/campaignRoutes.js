const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const verifyToken = require("../middleware/verifyToken");
const today = new Date();

router.get("/view", async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      endDate: { $gte: today } // campaigns that haven't ended yet
    }).sort({ startDate: 1 }); // soonest first

    res.status(200).json({ campaigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Register for a campaign (logged-in users only)
router.post("/:id/register", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const userId = req.user.id; // from JWT payload

    if (campaign.registeredUsers.includes(userId))
      return res.status(400).json({ message: "User already registered" });

    campaign.registeredUsers.push(userId);
    await campaign.save();

    res.status(200).json({ message: "User registered successfully", campaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
