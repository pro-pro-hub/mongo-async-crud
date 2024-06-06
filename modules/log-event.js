const { promises: fsPromises, ...fs } = require("fs");
const path = require("path");

// Npm packages/modules
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// Create a log events function
async function logEvent(msg, fileName) {
  const dateTime = format(new Date(), "yyyy/MM/dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${msg}\n`;
  const logsDir = path.join(__dirname, "..", "logs");
  try {
    // Create a logs dir if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }
    // Append the new log to the logs file
    await fsPromises.appendFile(path.join(logsDir, fileName), logItem);
    // Log a success message to the console
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  config: function () {
    process.logEvent = logEvent;
  },
};
