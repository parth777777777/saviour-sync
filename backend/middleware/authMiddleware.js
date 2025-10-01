const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });
  if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Malformed token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach id, email, role
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" });
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
