const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    age: { type: Number, required: true, min: 18, max: 70 },
    bloodGroup: { type: String, required: true, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    organs: [{ type: String, enum: ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"] }],
    lastDonation: { type: Date },
    donationHistory: [
      {
        type: { type: String, enum: ["Blood", "Platelets", "Plasma"], default: "Blood" },
        date: Date,
        location: String,
        volume: Number, // in ml
      },
    ],
    location: { type: String, required: true }, // city/village
    locationCoords: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verified: { type: Boolean, default: false },
    phone: { type: String },
    weight: { type: Number },
    medicalConditions: { type: String },
  },
  { timestamps: true, collection: "donors" }
);

// 2dsphere index for geospatial queries
donorSchema.index({ locationCoords: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);
