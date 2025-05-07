"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var TcpConfig = require('../models/tcp_configs_model');

var logger = require('../utils/logger');

exports.getTcpConfig = function _callee() {
  var machineId,
      config,
      _args = arguments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          machineId = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'machine_1';
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(TcpConfig.findOne({
            where: {
              machineId: machineId
            }
          }));

        case 4:
          config = _context.sent;

          if (config) {
            _context.next = 8;
            break;
          }

          logger.error("No TCP configuration found for machineId: ".concat(machineId));
          throw new Error("No TCP configuration found for machineId: ".concat(machineId));

        case 8:
          return _context.abrupt("return", {
            tcpHost: config.tcpHost,
            tcpPort: config.tcpPort
          });

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          logger.error("Error fetching TCP config: ".concat(_context.t0.message));
          throw _context.t0;

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
};

exports.saveTcpConfig = function _callee2(machineId, tcpHost, tcpPort) {
  var _ref, _ref2, config, created;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(TcpConfig.upsert({
            machineId: machineId,
            tcpHost: tcpHost,
            tcpPort: tcpPort
          }));

        case 3:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          config = _ref2[0];
          created = _ref2[1];
          logger.info("TCP config ".concat(created ? 'created' : 'updated', " for machineId: ").concat(machineId));
          return _context2.abrupt("return", config);

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          logger.error("Error saving TCP config: ".concat(_context2.t0.message));
          throw _context2.t0;

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.getAllTcpConfigs = function _callee3() {
  var configs;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(TcpConfig.findAll());

        case 3:
          configs = _context3.sent;
          return _context3.abrupt("return", configs.map(function (config) {
            return config.toJSON();
          }));

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          logger.error("Error fetching all TCP configs: ".concat(_context3.t0.message));
          throw _context3.t0;

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};