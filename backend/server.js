const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const combinedSearchRoutes = require("./routes/combinedSearchRoutes");

const app = express();

// Middleware: CORS and JSON parser must come before routes
app.use(
  cors({
    origin: "http://localhost:3000", // allow React frontend
    credentials: true, // optional, if you use cookies
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/search", combinedSearchRoutes);


// Test route
app.get("/", (req, res) => res.send("Backend is running!"));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

mongoose.connection.once("open", () =>
  console.log("Connected to DB:", mongoose.connection.name)
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
