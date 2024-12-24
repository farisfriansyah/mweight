"use strict";

// mweight/backend/socket/weightLogSocket.js
var WebSocket = require('ws');

var WeightLog = require('../models/WeightLog'); // Model yang sudah ada


var wss = new WebSocket.Server({
  port: 3003
}); // Gunakan port berbeda untuk WebSocket

wss.on('connection', function (ws) {
  console.log('WebSocket connected for weight logs'); // Kirimkan data terbaru saat pertama kali koneksi

  var sendWeightLogs = function sendWeightLogs() {
    var weightLogs;
    return regeneratorRuntime.async(function sendWeightLogs$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(WeightLog.findAll({
              order: [['timestamp', 'DESC']],
              limit: 200
            }));

          case 2:
            weightLogs = _context.sent;
            ws.send(JSON.stringify(weightLogs));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  sendWeightLogs(); // Simulasi pembaruan data (bisa diganti dengan logic yang sesuai)

  setInterval(function _callee() {
    var newLog, weightLogs;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(WeightLog.create({
              rawWeight: Math.random() * 1000,
              // Contoh data acak
              processedWeight: Math.random() * 1000
            }));

          case 2:
            newLog = _context2.sent;
            _context2.next = 5;
            return regeneratorRuntime.awrap(WeightLog.findAll({
              order: [['timestamp', 'DESC']],
              limit: 200
            }));

          case 5:
            weightLogs = _context2.sent;
            ws.send(JSON.stringify(weightLogs)); // Kirim data terbaru

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    });
  }, 5000); // Kirim data setiap 5 detik

  ws.on('close', function () {
    console.log('WebSocket disconnected for weight logs');
  });
});
module.exports = wss;