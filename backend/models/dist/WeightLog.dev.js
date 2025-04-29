"use strict";

// mweight/backend/models/WeightLog.js
var _require = require('sequelize'),
    DataTypes = _require.DataTypes,
    Op = _require.Op;

var sequelize = require('../config/db');

var moment = require('moment');

var WeightLog = sequelize.define('WeightLog', {
  rawWeight: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  processedWeight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'weight_logs',
  timestamps: false
});
WeightLog.beforeCreate(function (weightLog, options) {
  weightLog.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
});
module.exports = WeightLog;