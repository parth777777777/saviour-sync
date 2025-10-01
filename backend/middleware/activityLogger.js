// middlewares/activityLogger.js
const fs = require("fs");
const path = require("path");

const logActivity = (action, adminEmail, target) => {
  const log = `${new Date().toISOString()} | ${adminEmail} ${action} ${target}\n`;
  fs.appendFileSync(path.join(__dirname, "../logs/activity.log"), log);
};

module.exports = logActivity;
