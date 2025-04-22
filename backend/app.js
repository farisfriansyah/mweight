// mweight/backend/app.js

const express = require('express');
const WebSocket = require('ws');
const cors = require('cors'); // Import cors package
const weightRoutes = require('./routes/weightRoutes');
const { startAutomaticWeightSaving } = require('./services/weightSavingService');
const { watchWeightHistory } = require('./services/weightHistoryService');
const weightHistoryRoutes = require('./routes/weightHistoryRoutes');
const weightHistoryController = require('./controllers/weightHistoryController');
const weightController = require('./controllers/weightController');
const tcpService = require('./services/tcpService');
const config = require('./config/config');
const sequelize = require('./config/db');
const logger = require('./utils/logger'); // Import the winston logger

const app = express();

// Start automatic weight saving on server start
startAutomaticWeightSaving();

// Allow all origins or specify the origin of your frontend
app.use(cors({
  origin: 'http://10.88.6.51:3000', 
  //origin: 'http://localhost:3000',
  methods: 'GET,POST', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers for requests
}));

// Middleware to handle JSON requests
app.use(express.json());

// Use routes for API
app.use('/api', weightRoutes);

// Tambahkan rute weight-history
app.use('/api', weightHistoryRoutes);

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

// WebSocket Server
const wss = new WebSocket.Server({ port: config.wsPort });

wss.on('connection', (ws) => {
  logger.info('Client connected to WebSocket');
  console.log('Client connected to WebSocket');
  weightHistoryController.registerWebSocketClient(ws);

  // Kirim data real-time setiap detik
  const interval = setInterval(() => {
    weightController.sendRealTimeData(ws, true);  // Menggunakan fungsi yang sama untuk WebSocket
  }, 1000);

  // Kirim data weight history setiap kali ada pembaruan
  watchWeightHistory((weightHistory) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: 'weight-history', data: weightHistory }));
    }
  });

  ws.on('close', () => {
    logger.info('Client disconnected from WebSocket');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    logger.error('WebSocket Error:', error);
    clearInterval(interval);
  });
});

// Start the TCP connection
tcpService.startTcpConnection(config.tcpHost, config.tcpPort);

// Run API server
app.listen(config.apiPort, () => {
  // const message = `API server running at http://10.88.67.70:${config.apiPort}`;
  const message = `API server running at http://${config.urlHost}:${config.apiPort}`;
  console.log(message);
  logger.info(message);
});
