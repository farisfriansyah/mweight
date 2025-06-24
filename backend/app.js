// mweight/backend/app.js

const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const weightRoutes = require('./routes/weightRoutes');
const { startAutomaticWeightSaving } = require('./services/weightSavingService');
const { watchWeightHistory } = require('./services/weightHistoryService');
const weightHistoryRoutes = require('./routes/weightHistoryRoutes');
const weightHistoryController = require('./controllers/weightHistoryController');
const weightController = require('./controllers/weightController');
const tcpService = require('./services/tcpService');
const config = require('./config/configuration');
const sequelize = require('./config/db');
const logger = require('./utils/logger');
const TcpConfig = require('./models/tcp_configs_model');

const app = express();

// Allow all origins or specify the origin of your frontend
app.use(cors({
  origin: '*',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Authorization',
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

// Sync the database with Sequelize and start services
sequelize.sync()
  .then(async () => {
    logger.info('Database has been synchronized.');
    // Start automatic weight saving after DB sync
    startAutomaticWeightSaving();
    // Start TCP connection with database config
    const tcpConfig = await TcpConfig.findOne({ where: { machineId: 'machine_1' } });
    if (!tcpConfig) {
      throw new Error('No TCP configuration found for machine_1');
    }
    tcpService.startTcpConnection(tcpConfig.tcpHost, tcpConfig.tcpPort);
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
    weightController.sendRealTimeData(ws);
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

// Run API server
app.listen(config.apiPort, () => {
  const message = `API server running at http://${config.urlHost}:${config.apiPort}`;
  console.log(message);
  logger.info(message);
});