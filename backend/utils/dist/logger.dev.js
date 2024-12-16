"use strict";

var winston = require('winston');

var format = winston.format;
var combine = format.combine,
    timestamp = format.timestamp,
    printf = format.printf,
    errors = format.errors;

var DailyRotateFile = require('winston-daily-rotate-file'); // Import DailyRotateFile transport
// Define the log format for both console and file


var logFormat = printf(function (_ref) {
  var timestamp = _ref.timestamp,
      level = _ref.level,
      message = _ref.message,
      stack = _ref.stack;
  // If it's an error, include the stack trace
  return stack ? "".concat(timestamp, " [").concat(level, "]: ").concat(message, " \nStack trace: ").concat(stack) : "".concat(timestamp, " [").concat(level, "]: ").concat(message);
}); // Create a logger instance

var logger = winston.createLogger({
  level: 'info',
  // Set default log level
  format: combine(timestamp(), errors({
    stack: true
  }), // Include stack trace for errors
  logFormat),
  transports: [// Console transport: colored and formatted output
  new winston.transports.Console({
    format: combine(format.colorize(), timestamp(), logFormat)
  }), // File transport: daily rotating log files
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    // Maximum file size before rotating
    maxFiles: '14d' // Retain logs for 14 days

  })]
});
module.exports = logger;