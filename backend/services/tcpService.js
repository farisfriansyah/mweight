// mweight/backend/services/tcpService.js
const net = require('net');
const logger = require('../utils/logger');

let client = null;
let latestWeightData = null;
let retryAttempts = 0;
const maxRetryAttempts = 5;
const retryDelay = 5000; 

const startTcpConnection = (TCP_HOST, TCP_PORT) => {
  if (client) {
    client.destroy();
  }

  client = new net.Socket();

  client.connect(TCP_PORT, TCP_HOST, () => {
    logger.info(`Connected to TCP server at ${TCP_HOST}:${TCP_PORT}`);
    retryAttempts = 0;
  });

  client.on('data', (data) => {
    const weightData = data.toString().trim();
    logger.info(`Received data from TCP: ${weightData}`);
    console.log(weightData);
    latestWeightData = weightData;
  });

  client.on('error', (error) => {
    logger.error('TCP Client Error:', error);
    handleReconnect(TCP_HOST, TCP_PORT);
  });

  client.on('close', () => {
    logger.info('TCP connection closed');
    handleReconnect(TCP_HOST, TCP_PORT);
  });
};

const handleReconnect = (TCP_HOST, TCP_PORT) => {
  if (retryAttempts < maxRetryAttempts) {
    logger.warn(`Retrying connection... Attempt ${retryAttempts + 1}`);
    retryAttempts++;
    setTimeout(() => startTcpConnection(TCP_HOST, TCP_PORT), retryDelay);
  } else {
    logger.error('Max retry attempts reached. Connection failed.');
  }
};

const getVehicleWeight = () => {
  if (!latestWeightData) {
    logger.warn('No weight data available');
    return null;
  }
  return latestWeightData;
};

module.exports = {
  startTcpConnection,
  getVehicleWeight,
};
