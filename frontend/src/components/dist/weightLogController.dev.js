"use strict";

// mweight/backend/controllers/weightLogController.js
var WeightLog = require('../models/WeightLog'); // Model yang sudah ada


var getWeightLogs = function getWeightLogs(req, res) {
  var weightLogs;
  return regeneratorRuntime.async(function getWeightLogs$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(WeightLog.findAll({
            order: [['timestamp', 'DESC']],
            limit: 200 // Ambil 200 data terbaru

          }));

        case 3:
          weightLogs = _context.sent;
          res.json(weightLogs);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching weight logs:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  getWeightLogs: getWeightLogs
};