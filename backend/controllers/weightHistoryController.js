// mweight/backend/controllers/weightHistoryController.js

const { fetchWeightHistory } = require('../services/weightHistoryService');
const WeightLog = require('../models/WeightLog'); // Import model WeightLog
const logger = require('../utils/logger');
const WebSocket = require('ws');

// Map untuk menyimpan client WebSocket
const websocketClients = new Map();
let clientId = 0;

// Function untuk mendapatkan weight history
exports.getWeightHistory = async (req, res) => {
  try {
    // Ambil data dari database berdasarkan timestamp (desc) dan limit 200
    const weightLogs = await WeightLog.findAll({
      attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'], // Kolom yang dipilih
      order: [['timestamp', 'DESC']], // Urutkan berdasarkan timestamp descending
      limit: 300, // Limit data
    });

    // Kirim response dalam format JSON
    res.json({
      message: 'Weight history retrieved successfully',
      data: weightLogs,
    });
  } catch (error) {
    logger.error('Error fetching weight history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function untuk mengirim update real-time via WebSocket
exports.broadcastNewWeight = (newWeightLog) => {
  const payload = JSON.stringify({
    message: 'New weight log entry',
    data: newWeightLog,
  });

  // Kirim ke semua WebSocket clients
  websocketClients.forEach((client, id) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

// Function untuk menambahkan client ke WebSocket list menggunakan Map
exports.registerWebSocketClient = (ws) => {
  const currentClientId = ++clientId; // Buat ID unik untuk client
  websocketClients.set(currentClientId, ws);

  ws.on('close', () => {
    websocketClients.delete(currentClientId);
    logger.info(`Client ${currentClientId} disconnected.`);
  });

  ws.on('error', (error) => {
    websocketClients.delete(currentClientId);
    logger.error(`Client ${currentClientId} encountered error:`, error);
  });
};
