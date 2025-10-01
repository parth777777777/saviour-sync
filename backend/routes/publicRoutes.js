const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => res.json({ message: "Welcome Home" }));
router.get("/about", (req, res) => res.json({ message: "About Page" }));
router.get("/contact", (req, res) => res.json({ message: "Contact Page" }));

module.exports = router;
