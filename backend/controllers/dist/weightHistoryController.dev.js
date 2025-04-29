"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// mweight/backend/controllers/weightHistoryController.js
var _require = require('../services/weightHistoryService'),
    fetchWeightHistory = _require.fetchWeightHistory;

var WeightLog = require('../models/WeightLog');

var logger = require('../utils/logger');

var WebSocket = require('ws');

var moment = require('moment-timezone');

var _require2 = require('sequelize'),
    Op = _require2.Op; // Map untuk menyimpan client WebSocket


var websocketClients = new Map();
var clientId = 0; // Function untuk mendapatkan weight history

exports.getWeightHistory = function _callee(req, res) {
  var now, currentDate, currentHour, isAutoSaveActive, startOfDay, endOfDay, weightLogs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          now = moment.tz('Asia/Jakarta');
          currentDate = now.format('YYYY-MM-DD');
          currentHour = now.hour();
          isAutoSaveActive = currentHour >= 7 && currentHour < 22;
          logger.info("Fetching weight history for date: ".concat(currentDate, ", auto save active: ").concat(isAutoSaveActive));
          startOfDay = moment.tz(currentDate, 'Asia/Jakarta').startOf('day').utc().toDate();
          endOfDay = moment.tz(currentDate, 'Asia/Jakarta').endOf('day').utc().toDate();
          _context.next = 10;
          return regeneratorRuntime.awrap(WeightLog.findAll({
            attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'],
            where: {
              timestamp: _defineProperty({}, Op.between, [startOfDay, endOfDay])
            },
            order: [['timestamp', 'DESC']],
            limit: 300
          }));

        case 10:
          weightLogs = _context.sent;
          logger.info("Found ".concat(weightLogs.length, " records for date: ").concat(currentDate));
          res.json({
            message: 'Weight history retrieved successfully',
            data: weightLogs
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          logger.error('Error fetching weight history:', _context.t0);
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // Function untuk mendapatkan weight history harian


exports.getDailyWeightHistory = function _callee2(req, res) {
  var date, startOfDay, endOfDay, weightLogs;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          date = req.query.date;
          logger.info("Fetching daily weight history for date: ".concat(date));

          if (!(!date || !moment(date, 'YYYY-MM-DD', true).isValid())) {
            _context2.next = 6;
            break;
          }

          logger.warn("Invalid date parameter: ".concat(date));
          return _context2.abrupt("return", res.status(400).json({
            message: 'Valid date parameter (YYYY-MM-DD) is required'
          }));

        case 6:
          startOfDay = moment.tz(date, 'Asia/Jakarta').startOf('day').utc().toDate();
          endOfDay = moment.tz(date, 'Asia/Jakarta').endOf('day').utc().toDate();
          logger.info("Query range: ".concat(startOfDay, " to ").concat(endOfDay));
          _context2.next = 11;
          return regeneratorRuntime.awrap(WeightLog.findAll({
            attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'],
            where: {
              timestamp: _defineProperty({}, Op.between, [startOfDay, endOfDay])
            },
            order: [['timestamp', 'ASC']]
          }));

        case 11:
          weightLogs = _context2.sent;
          logger.info("Found ".concat(weightLogs.length, " records for date: ").concat(date));
          res.json({
            message: 'Daily weight history retrieved successfully',
            data: weightLogs
          });
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          logger.error("Error fetching daily weight history for date ".concat(req.query.date, ": ").concat(_context2.t0.message));
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // Function untuk mengirim update real-time via WebSocket


exports.broadcastNewWeight = function (newWeightLog) {
  var logDate = moment.tz(newWeightLog.timestamp, 'Asia/Jakarta').format('YYYY-MM-DD');
  var currentDate = moment.tz('Asia/Jakarta').format('YYYY-MM-DD');

  if (logDate !== currentDate) {
    logger.info("Skipping WebSocket broadcast for non-current date: ".concat(logDate));
    return;
  }

  var payload = JSON.stringify({
    message: 'New weight log entry',
    data: newWeightLog
  });
  websocketClients.forEach(function (client, id) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
      logger.info("Sent WebSocket update to client ".concat(id, " for date: ").concat(logDate));
    }
  });
}; // Function untuk menambahkan client ke WebSocket list


exports.registerWebSocketClient = function (ws) {
  var currentClientId = ++clientId;
  websocketClients.set(currentClientId, ws);
  ws.on('close', function () {
    websocketClients["delete"](currentClientId);
    logger.info("Client ".concat(currentClientId, " disconnected."));
  });
  ws.on('error', function (error) {
    websocketClients["delete"](currentClientId);
    logger.error("Client ".concat(currentClientId, " encountered error:"), error);
  });
};