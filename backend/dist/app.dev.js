"use strict";

// mweight/backend/app.js
var express = require('express');

var WebSocket = require('ws');

var cors = require('cors');

var weightRoutes = require('./routes/weightRoutes');

var _require = require('./services/weightSavingService'),
    startAutomaticWeightSaving = _require.startAutomaticWeightSaving;

var _require2 = require('./services/weightHistoryService'),
    watchWeightHistory = _require2.watchWeightHistory;

var weightHistoryRoutes = require('./routes/weightHistoryRoutes');

var weightHistoryController = require('./controllers/weightHistoryController');

var weightController = require('./controllers/weightController');

var tcpService = require('./services/tcpService');

var config = require('./config/configuration');

var sequelize = require('./config/db');

var logger = require('./utils/logger');

var TcpConfig = require('./models/tcp_configs_model');

var app = express(); // Allow all origins or specify the origin of your frontend

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Authorization'
})); // Middleware to handle JSON requests

app.use(express.json()); // Use routes for API

app.use('/api', weightRoutes); // Tambahkan rute weight-history

app.use('/api', weightHistoryRoutes); // Home route for checking if server is running

app.get('/', function (req, res) {
  logger.info('GET request received at /');
  res.send('Hello, World!');
}); // Sync the database with Sequelize and start services

sequelize.sync().then(function _callee() {
  var tcpConfig;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          logger.info('Database has been synchronized.'); // Start automatic weight saving after DB sync

          startAutomaticWeightSaving(); // Start TCP connection with database config

          _context.next = 4;
          return regeneratorRuntime.awrap(TcpConfig.findOne({
            where: {
              machineId: 'machine_1'
            }
          }));

        case 4:
          tcpConfig = _context.sent;

          if (tcpConfig) {
            _context.next = 7;
            break;
          }

          throw new Error('No TCP configuration found for machine_1');

        case 7:
          tcpService.startTcpConnection(tcpConfig.tcpHost, tcpConfig.tcpPort);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
})["catch"](function (err) {
  logger.error('Failed to sync database:', err);
}); // WebSocket Server

var wss = new WebSocket.Server({
  port: config.wsPort
});
wss.on('connection', function (ws) {
  logger.info('Client connected to WebSocket');
  console.log('Client connected to WebSocket');
  weightHistoryController.registerWebSocketClient(ws); // Kirim data real-time setiap detik

  var interval = setInterval(function () {
    weightController.sendRealTimeData(ws);
  }, 1000); // Kirim data weight history setiap kali ada pembaruan

  watchWeightHistory(function (weightHistory) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        event: 'weight-history',
        data: weightHistory
      }));
    }
  });
  ws.on('close', function () {
    logger.info('Client disconnected from WebSocket');
    clearInterval(interval);
  });
  ws.on('error', function (error) {
    logger.error('WebSocket Error:', error);
    clearInterval(interval);
  });
}); // Run API server

app.listen(config.apiPort, function () {
  var message = "API server running at http://".concat(config.urlHost, ":").concat(config.apiPort);
  console.log(message);
  logger.info(message);
});