// middleware/admin.js
const adminMiddleware = (req, res, next) => {
  // req.user comes from your verifyToken middleware
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = adminMiddleware;
