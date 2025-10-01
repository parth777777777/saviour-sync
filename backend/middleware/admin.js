const verifyToken = require("./verifyToken");

function adminMiddleware(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin only." });
    }
  });
}

module.exports = adminMiddleware;
