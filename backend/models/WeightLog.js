// mweight/backend/models/WeightLog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Path to your sequelize instance
const moment = require('moment');

const WeightLog = sequelize.define('WeightLog', {
  rawWeight: {
    type: DataTypes.TEXT, // Use TEXT to store raw weight string
    allowNull: false, // Ensure rawWeight is not null
  },
  processedWeight: {
    type: DataTypes.FLOAT, // Store processed weight as a float
    allowNull: true, // Allow processedWeight to be null if not processed
  },
  timestamp: {
    type: DataTypes.DATE, // Use DATE for timestamp
    allowNull: false, // Ensure timestamp is not null
    defaultValue: DataTypes.NOW, // Let Sequelize set the timestamp dynamically when the record is inserted
  },
}, {
  tableName: 'weight_logs', // Ensure it matches your table name in DB
  timestamps: false, // Disable automatic Sequelize timestamps (createdAt, updatedAt)
});

// Optional: If you want to manually control the timestamp before inserting
WeightLog.beforeCreate((weightLog, options) => {
  weightLog.timestamp = moment().format('YYYY-MM-DD HH:mm:ss'); // Set timestamp manually using moment.js if needed
});

module.exports = WeightLog;