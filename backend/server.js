// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Middleware
const errorHandler = require("./middleware/errorhandler");
const activityLogger = require("./middleware/activityLogger");

// Routes
const authRoutes = require("./routes/authRoutes"); // updated auth routes
const contactRoutes = require("./routes/contactRoutes");
const combinedSearchRoutes = require("./routes/combinedSearchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(activityLogger);

// --- Auth Routes ---
app.use("/api/auth", authRoutes); 

// --- Other Routes ---
app.use("/api/contact", contactRoutes);
app.use("/api/search", combinedSearchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donors", donorRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Error handler (should always be last)
app.use(errorHandler);

// --- DB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.once("open", () =>
  console.log("Connected to DB:", mongoose.connection.name)
);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
