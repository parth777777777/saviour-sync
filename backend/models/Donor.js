const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);
