"use strict";

// mweight/backend/controllers/weightHistoryController.js
var _require = require('../services/weightHistoryService'),
    fetchWeightHistory = _require.fetchWeightHistory;

var WeightLog = require('../models/WeightLog'); // Import model WeightLog


var logger = require('../utils/logger');

var WebSocket = require('ws'); // Map untuk menyimpan client WebSocket


var websocketClients = new Map();
var clientId = 0; // Function untuk mendapatkan weight history

exports.getWeightHistory = function _callee(req, res) {
  var weightLogs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(WeightLog.findAll({
            attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'],
            // Kolom yang dipilih
            order: [['timestamp', 'DESC']],
            // Urutkan berdasarkan timestamp descending
            limit: 300 // Limit data

          }));

        case 3:
          weightLogs = _context.sent;
          // Kirim response dalam format JSON
          res.json({
            message: 'Weight history retrieved successfully',
            data: weightLogs
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          logger.error('Error fetching weight history:', _context.t0);
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Function untuk mengirim update real-time via WebSocket


exports.broadcastNewWeight = function (newWeightLog) {
  var payload = JSON.stringify({
    message: 'New weight log entry',
    data: newWeightLog
  }); // Kirim ke semua WebSocket clients

  websocketClients.forEach(function (client, id) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}; // Function untuk menambahkan client ke WebSocket list menggunakan Map


exports.registerWebSocketClient = function (ws) {
  var currentClientId = ++clientId; // Buat ID unik untuk client

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