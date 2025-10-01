const verifyToken = require("./verifyToken");

const adminMiddleware = (req, res, next) => {
  // First verify JWT
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: admin only" });
    }
    next();
  });
};

module.exports = adminMiddleware;
