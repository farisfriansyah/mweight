"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWeightData = void 0;
// src/api/api.js
var API_URL = 'http://localhost:3001/api/weight'; // Endpoint API

var fetchWeightData = function fetchWeightData() {
  var response, data;
  return regeneratorRuntime.async(function fetchWeightData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(API_URL));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Failed to fetch API data');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching API data:', _context.t0);
          return _context.abrupt("return", null);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.fetchWeightData = fetchWeightData;