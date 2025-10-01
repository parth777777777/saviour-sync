const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // secret in .env
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
}

module.exports = verifyToken;
