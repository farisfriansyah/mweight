"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveCapturedWeight = exports.fetchVehicleWeight = void 0;
var API_BASE_URL = 'http://localhost:3001/api'; // Fungsi untuk mengambil data berat kendaraan

var fetchVehicleWeight = function fetchVehicleWeight() {
  var response, data;
  return regeneratorRuntime.async(function fetchVehicleWeight$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/weight")));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error("Gagal mengambil data: ".concat(response.statusText));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error saat mengambil data berat:', _context.t0);
          throw _context.t0;

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}; // Fungsi untuk menyimpan data berat yang ditangkap


exports.fetchVehicleWeight = fetchVehicleWeight;

var saveCapturedWeight = function saveCapturedWeight(weightData) {
  var response, data;
  return regeneratorRuntime.async(function saveCapturedWeight$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/weight/capture"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(weightData)
          }));

        case 3:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 6;
            break;
          }

          throw new Error("Gagal menyimpan data: ".concat(response.statusText));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context2.sent;
          return _context2.abrupt("return", data);

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error('Error saat menyimpan data berat:', _context2.t0);
          throw _context2.t0;

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.saveCapturedWeight = saveCapturedWeight;