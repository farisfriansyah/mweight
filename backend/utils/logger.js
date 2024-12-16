const winston = require('winston');
const { format } = winston;
const { combine, timestamp, printf, errors } = format;
const DailyRotateFile = require('winston-daily-rotate-file'); // Import DailyRotateFile transport

// Define the log format for both console and file
const logFormat = printf(({ timestamp, level, message, stack }) => {
  // If it's an error, include the stack trace
  return stack
    ? `${timestamp} [${level}]: ${message} \nStack trace: ${stack}`
    : `${timestamp} [${level}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',  // Set default log level
  format: combine(
    timestamp(),
    errors({ stack: true }),  // Include stack trace for errors
    logFormat
  ),
  transports: [
    // Console transport: colored and formatted output
    new winston.transports.Console({
      format: combine(
        format.colorize(),
        timestamp(),
        logFormat
      )
    }),

    // File transport: daily rotating log files
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',  // Maximum file size before rotating
      maxFiles: '14d',  // Retain logs for 14 days
    })
  ]
});

module.exports = logger;
