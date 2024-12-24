"use strict";

// mweight/backend/services/weightHistoryService.js
var WeightLog = require('../models/WeightLog');

var logger = require('../utils/logger'); // Fungsi untuk mengambil data berat terbaru dari database


var fetchWeightHistory = function fetchWeightHistory() {
  var weightHistory;
  return regeneratorRuntime.async(function fetchWeightHistory$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(WeightLog.findAll({
            attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'],
            order: [['timestamp', 'DESC']],
            limit: 200
          }));

        case 3:
          weightHistory = _context.sent;
          return _context.abrupt("return", weightHistory.map(function (entry) {
            return entry.toJSON();
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          logger.error("Error fetching weight history: ".concat(_context.t0.message));
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Fungsi untuk memantau perubahan pada tabel dan memperbarui data jika ada yang baru


var watchWeightHistory = function watchWeightHistory(callback) {
  var latestTimestamp = null;

  var fetchAndUpdate = function fetchAndUpdate() {
    var weightHistory, newLatestTimestamp;
    return regeneratorRuntime.async(function fetchAndUpdate$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(fetchWeightHistory());

          case 3:
            weightHistory = _context2.sent;

            if (weightHistory.length > 0) {
              newLatestTimestamp = weightHistory[0].timestamp; // Periksa apakah ada pembaruan data

              if (!latestTimestamp || newLatestTimestamp > latestTimestamp) {
                latestTimestamp = newLatestTimestamp;
                callback(weightHistory); // Panggil callback dengan data terbaru
              }
            }

            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            logger.error("Error watching weight history: ".concat(_context2.t0.message));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }; // Jalankan secara berkala setiap detik


  setInterval(fetchAndUpdate, 1000);
};

module.exports = {
  fetchWeightHistory: fetchWeightHistory,
  watchWeightHistory: watchWeightHistory
};