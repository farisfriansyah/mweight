"use strict";

// mweight/backend/app.js
var express = require('express');

var WebSocket = require('ws');

var cors = require('cors'); // Import cors package


var weightRoutes = require('./routes/weightRoutes');

var _require = require('./services/weightSavingService'),
    startAutomaticWeightSaving = _require.startAutomaticWeightSaving;

var _require2 = require('./services/weightHistoryService'),
    watchWeightHistory = _require2.watchWeightHistory;

var weightHistoryRoutes = require('./routes/weightHistoryRoutes');

var weightHistoryController = require('./controllers/weightHistoryController');

var weightController = require('./controllers/weightController');

var tcpService = require('./services/tcpService');

var config = require('./config/config');

var sequelize = require('./config/db');

var logger = require('./utils/logger'); // Import the winston logger


var app = express(); // Start automatic weight saving on server start

startAutomaticWeightSaving(); // Allow all origins or specify the origin of your frontend

app.use(cors({
  //origin: 'http://10.88.67.70:3000',  Specify your frontend URL
  origin: 'http://localhost:3000',
  // Specify your frontend URL
  methods: 'GET,POST',
  // Allow specific HTTP methods
  allowedHeaders: 'Content-Type, Authorization' // Allowed headers for requests

})); // Middleware to handle JSON requests

app.use(express.json()); // Use routes for API

app.use('/api', weightRoutes); // Tambahkan rute weight-history

app.use('/api', weightHistoryRoutes); // Home route for checking if server is running

app.get('/', function (req, res) {
  logger.info('GET request received at /');
  res.send('Hello, World!');
}); // Sync the database with Sequelize

sequelize.sync().then(function () {
  logger.info('Database has been synchronized.');
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
    weightController.sendRealTimeData(ws, true); // Menggunakan fungsi yang sama untuk WebSocket
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
}); // Start the TCP connection

tcpService.startTcpConnection(config.tcpHost, config.tcpPort); // Run API server

app.listen(config.apiPort, function () {
  // const message = `API server running at http://10.88.67.70:${config.apiPort}`;
  var message = "API server running at http://".concat(config.urlHost, ":").concat(config.apiPort);
  console.log(message);
  logger.info(message);
});