const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/activity.log");

// Ensure logs folder exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logActivity = (req, res, next) => {
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
  fs.appendFileSync(logFilePath, logEntry);
  next();
};

module.exports = logActivity;
