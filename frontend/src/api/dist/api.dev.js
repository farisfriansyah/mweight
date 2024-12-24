"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWeightHistoryData = exports.fetchWeightData = void 0;
// mweight/frontend/src/api/api.js
var API_WEIGHT_URL = process.env.REACT_APP_API_WEIGHT_URL || 'http://localhost:3001/api/weight';
var API_WEIGHT_HISTORY_URL = process.env.REACT_APP_API_WEIGHT_HISTORY_URL || 'http://localhost:3001/api/weight-history';

var fetchWeightData = function fetchWeightData() {
  var response, data;
  return regeneratorRuntime.async(function fetchWeightData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(API_WEIGHT_URL));

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

var fetchWeightHistoryData = function fetchWeightHistoryData() {
  var response, data;
  return regeneratorRuntime.async(function fetchWeightHistoryData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch(API_WEIGHT_HISTORY_URL));

        case 3:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 6;
            break;
          }

          throw new Error('Failed to fetch API data');

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context2.sent;
          return _context2.abrupt("return", data);

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching API data:', _context2.t0);
          return _context2.abrupt("return", null);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.fetchWeightHistoryData = fetchWeightHistoryData;