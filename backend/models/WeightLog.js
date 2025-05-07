// mweight/backend/models/WeightLog.js
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');
const moment = require('moment');

const WeightLog = sequelize.define('WeightLog', {
  rawWeight: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  processedWeight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'weight_logs',
  timestamps: false,
});

WeightLog.beforeCreate((weightLog, options) => {
  weightLog.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
});

module.exports = WeightLog;