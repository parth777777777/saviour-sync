// models/Campaign.js
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  orgId: { type: String, required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  locationCoords: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  registeredUsers: [
    {
      userId: String,
      donated: { type: Boolean, default: false },
      amount: Number,
    },
  ],
});

// Add geospatial index for location queries
campaignSchema.index({ locationCoords: "2dsphere" });

module.exports = mongoose.model("Campaign", campaignSchema);
