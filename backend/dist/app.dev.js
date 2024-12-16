"use strict";

var express = require('express');

var WebSocket = require('ws');

var cors = require('cors'); // Import cors package


var weightRoutes = require('./routes/weightRoutes');

var _require = require('./services/weightSavingService'),
    startAutomaticWeightSaving = _require.startAutomaticWeightSaving;

var tcpService = require('./services/tcpService');

var config = require('./config/config');

var sequelize = require('./config/db');

var logger = require('./utils/logger'); // Import the winston logger


var app = express(); // Start automatic weight saving on server start

startAutomaticWeightSaving(); // Allow all origins or specify the origin of your frontend

app.use(cors({
  origin: 'http://localhost:3000',
  // Specify your frontend URL
  methods: 'GET,POST',
  // Allow specific HTTP methods
  allowedHeaders: 'Content-Type, Authorization' // Allowed headers for requests

})); // Middleware to handle JSON requests

app.use(express.json()); // Use routes for API

app.use('/api', weightRoutes); // Home route for checking if server is running

app.get('/', function (req, res) {
  logger.info('GET request received at /');
  res.send('Hello, World!');
}); // Sync the database with Sequelize

sequelize.sync().then(function () {
  logger.info('Database has been synchronized.');
})["catch"](function (err) {
  logger.error('Failed to sync database:', err);
}); // Run API server on specified port

app.listen(config.apiPort, function () {
  var message = "API server running at http://localhost:".concat(config.apiPort);
  console.log(message);
  logger.info(message);
}); // Setup WebSocket server on the specified port

var wss = new WebSocket.Server({
  port: config.wsPort
});
wss.on('connection', function (ws) {
  logger.info('Client connected to WebSocket');
  console.log('Client connected to WebSocket'); // Send vehicle weight every second

  var sendWeight = function sendWeight() {
    var weight = tcpService.getVehicleWeight();

    if (weight) {
      ws.send(JSON.stringify({
        weight: weight
      }));
    }
  }; // Send data every 1 second


  var interval = setInterval(sendWeight, 1000); // Handle WebSocket disconnection

  ws.on('close', function () {
    logger.info('WebSocket client disconnected');
    console.log('WebSocket client disconnected');
    clearInterval(interval);
  }); // Handle WebSocket errors

  ws.on('error', function (error) {
    logger.error('WebSocket Error:', error);
    console.error('WebSocket Error:', error);
    clearInterval(interval);
  });
}); // Start the TCP connection

tcpService.startTcpConnection(config.tcpHost, config.tcpPort);