"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveCapturedWeight = exports.fetchVehicleWeight = void 0;

// src/api/api.js
var fetchVehicleWeight = function fetchVehicleWeight() {
  var response;
  return regeneratorRuntime.async(function fetchVehicleWeight$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('http://localhost:3001/api/weight'));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Gagal mengambil data berat kendaraan');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          return _context.abrupt("return", _context.sent);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          throw _context.t0;

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.fetchVehicleWeight = fetchVehicleWeight;

var saveCapturedWeight = function saveCapturedWeight(weightData) {
  var response;
  return regeneratorRuntime.async(function saveCapturedWeight$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch('http://localhost:3001/api/weight/capture', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(weightData)
          }));

        case 3:
          response = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          return _context2.abrupt("return", _context2.sent);

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Error menyimpan data berat:', _context2.t0);
          throw _context2.t0;

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.saveCapturedWeight = saveCapturedWeight;