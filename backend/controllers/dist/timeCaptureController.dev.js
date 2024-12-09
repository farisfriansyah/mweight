"use strict";

var TimeCapture = require('../models/TimeCapture'); // Endpoint untuk menyimpan data capture


exports.saveCapture = function _callee(req, res) {
  var _req$body, timestamp, weight, newCapture;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, timestamp = _req$body.timestamp, weight = _req$body.weight; // Ambil data timestamp dan weight dari body request
          // Validasi data

          if (!(!timestamp || !weight)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Timestamp dan weight harus disediakan'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(TimeCapture.create({
            timestamp: timestamp,
            weight: weight
          }));

        case 6:
          newCapture = _context.sent;
          res.status(201).json({
            message: 'Data capture berhasil disimpan',
            data: newCapture
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Terjadi kesalahan saat menyimpan data capture'
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};