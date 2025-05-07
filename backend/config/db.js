// mweight/backend/config/db.js

require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger'); // Import logger

// Create Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Disable logging of queries for clean logs
    timezone: '+07:00', // Zona waktu Jakarta
  }
);

// Test connection to the database
sequelize.authenticate()
  .then(() => {
    // Log success with winston (to console and file)
    logger.info('Database connection successful!');
  })
  .catch((err) => {
    // Log error if database connection fails
    logger.error('Database connection failed: ' + err.message);
  });

module.exports = sequelize;