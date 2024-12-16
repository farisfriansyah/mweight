const express = require('express');
const WebSocket = require('ws');
const cors = require('cors'); // Import cors package
const weightRoutes = require('./routes/weightRoutes');
const { startAutomaticWeightSaving } = require('./services/weightSavingService');
const tcpService = require('./services/tcpService');
const config = require('./config/config');
const sequelize = require('./config/db');
const logger = require('./utils/logger'); // Import the winston logger

const app = express();

// Start automatic weight saving on server start
startAutomaticWeightSaving();

// Allow all origins or specify the origin of your frontend
app.use(cors({
  origin: 'http://localhost:3000', // Specify your frontend URL
  methods: 'GET,POST', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers for requests
}));

// Middleware to handle JSON requests
app.use(express.json());

// Use routes for API
app.use('/api', weightRoutes);

// Home route for checking if server is running
app.get('/', (req, res) => {
  logger.info('GET request received at /');
  res.send('Hello, World!');
});

// Sync the database with Sequelize
sequelize.sync()
  .then(() => {
    logger.info('Database has been synchronized.');
  })
  .catch((err) => {
    logger.error('Failed to sync database:', err);
  });

// Run API server on specified port
app.listen(config.apiPort, () => {
  const message = `API server running at http://localhost:${config.apiPort}`;
  console.log(message);
  logger.info(message);
});

// Setup WebSocket server on the specified port
const wss = new WebSocket.Server({ port: config.wsPort });

wss.on('connection', (ws) => {
  logger.info('Client connected to WebSocket');
  console.log('Client connected to WebSocket');

  // Send vehicle weight every second
  const sendWeight = () => {
    const weight = tcpService.getVehicleWeight();
    if (weight) {
      ws.send(JSON.stringify({ weight }));
    }
  };

  // Send data every 1 second
  const interval = setInterval(sendWeight, 1000);

  // Handle WebSocket disconnection
  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
    console.log('WebSocket client disconnected');
    clearInterval(interval);
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    logger.error('WebSocket Error:', error);
    console.error('WebSocket Error:', error);
    clearInterval(interval);
  });
});

// Start the TCP connection
tcpService.startTcpConnection(config.tcpHost, config.tcpPort);
