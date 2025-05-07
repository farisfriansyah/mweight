"use strict";

var express = require('express');

var _require = require('../services/tcpConfigService'),
    getAllTcpConfigs = _require.getAllTcpConfigs,
    saveTcpConfig = _require.saveTcpConfig;

var logger = require('../utils/logger');

var router = express.Router(); // Get all TCP configurations

router.get('/tcp-configs', function _callee(req, res) {
  var configs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(getAllTcpConfigs());

        case 3:
          configs = _context.sent;
          res.json({
            message: 'TCP configurations retrieved successfully',
            data: configs
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          logger.error("Error fetching TCP configs: ".concat(_context.t0.message));
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Save or update a TCP configuration

router.post('/tcp-configs', function _callee2(req, res) {
  var _req$body, machineId, tcpHost, tcpPort, config;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, machineId = _req$body.machineId, tcpHost = _req$body.tcpHost, tcpPort = _req$body.tcpPort;

          if (!(!machineId || !tcpHost || !tcpPort)) {
            _context2.next = 4;
            break;
          }

          logger.warn('Missing required fields in TCP config request');
          return _context2.abrupt("return", res.status(400).json({
            message: 'machineId, tcpHost, and tcpPort are required'
          }));

        case 4:
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(saveTcpConfig(machineId, tcpHost, parseInt(tcpPort, 10)));

        case 7:
          config = _context2.sent;
          res.json({
            message: 'TCP configuration saved successfully',
            data: config
          });
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](4);
          logger.error("Error saving TCP config: ".concat(_context2.t0.message));
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 11]]);
});
module.exports = router;