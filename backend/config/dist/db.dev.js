"use strict";

// mweight/backend/config/db.js
require('dotenv').config(); // Load environment variables from .env file


var _require = require('sequelize'),
    Sequelize = _require.Sequelize;

var logger = require('../utils/logger'); // Import logger
// Create Sequelize connection


var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
  // Disable logging of queries for clean logs
  timezone: '+07:00' // Zona waktu Jakarta

}); // Test connection to the database

sequelize.authenticate().then(function () {
  // Log success with winston (to console and file)
  logger.info('Database connection successful!');
})["catch"](function (err) {
  // Log error if database connection fails
  logger.error('Database connection failed: ' + err.message);
});
module.exports = sequelize;