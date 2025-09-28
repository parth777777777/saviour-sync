const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    location: { type: String, required: true }, // city/village name
    locationCoords: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    organ: {
      type: String,
      enum: ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes", null],
      default: null,
    },
    createdBy: { type: String }, // optional: email of user who registered this donor
  },
  { timestamps: true, collection: "donors" }
);

// Add 2dsphere index for geospatial queries
donorSchema.index({ locationCoords: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);
