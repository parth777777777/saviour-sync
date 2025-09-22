const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const donorRoutes = require("./routes/donorRoutes");

const app = express(); // ✅ app must be defined BEFORE using it

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/donors", donorRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
