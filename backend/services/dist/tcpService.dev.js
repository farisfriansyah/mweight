"use strict";

// mweight/backend/services/tcpService.js
var net = require('net');

var logger = require('../utils/logger');

var client = null;
var latestWeightData = null;
var retryAttempts = 0;
var maxRetryAttempts = 5;
var retryDelay = 5000;

var startTcpConnection = function startTcpConnection(TCP_HOST, TCP_PORT) {
  if (client) {
    client.destroy();
  }

  client = new net.Socket();
  client.connect(TCP_PORT, TCP_HOST, function () {
    logger.info("Connected to TCP server at ".concat(TCP_HOST, ":").concat(TCP_PORT));
    retryAttempts = 0;
  });
  client.on('data', function (data) {
    var weightData = data.toString().trim();
    logger.info("Received data from TCP: ".concat(weightData));
    console.log(weightData);
    latestWeightData = weightData;
  });
  client.on('error', function (error) {
    logger.error('TCP Client Error:', error);
    handleReconnect(TCP_HOST, TCP_PORT);
  });
  client.on('close', function () {
    logger.info('TCP connection closed');
    handleReconnect(TCP_HOST, TCP_PORT);
  });
};

var handleReconnect = function handleReconnect(TCP_HOST, TCP_PORT) {
  if (retryAttempts < maxRetryAttempts) {
    logger.warn("Retrying connection... Attempt ".concat(retryAttempts + 1));
    retryAttempts++;
    setTimeout(function () {
      return startTcpConnection(TCP_HOST, TCP_PORT);
    }, retryDelay);
  } else {
    logger.error('Max retry attempts reached. Connection failed.');
  }
};

var getVehicleWeight = function getVehicleWeight() {
  if (!latestWeightData) {
    logger.warn('No weight data available');
    return null;
  }

  return latestWeightData;
};

module.exports = {
  startTcpConnection: startTcpConnection,
  getVehicleWeight: getVehicleWeight
};