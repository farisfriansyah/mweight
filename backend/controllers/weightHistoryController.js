// mweight/backend/controllers/weightHistoryController.js

const { fetchWeightHistory } = require('../services/weightHistoryService');
const WeightLog = require('../models/WeightLog');
const logger = require('../utils/logger');
const WebSocket = require('ws');
const moment = require('moment-timezone');
const { Op } = require('sequelize');

// Map untuk menyimpan client WebSocket
const websocketClients = new Map();
let clientId = 0;

// Function untuk mendapatkan weight history
exports.getWeightHistory = async (req, res) => {
  try {
    const now = moment.tz('Asia/Jakarta');
    const currentDate = now.format('YYYY-MM-DD');
    const currentHour = now.hour();
    const isAutoSaveActive = currentHour >= 7 && currentHour < 22;

    logger.info(`Fetching weight history for date: ${currentDate}, auto save active: ${isAutoSaveActive}`);

    const startOfDay = moment.tz(currentDate, 'Asia/Jakarta').startOf('day').utc().toDate();
    const endOfDay = moment.tz(currentDate, 'Asia/Jakarta').endOf('day').utc().toDate();

    const weightLogs = await WeightLog.findAll({
      attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'],
      where: {
        timestamp: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [['timestamp', 'DESC']],
      limit: 300,
    });

    logger.info(`Found ${weightLogs.length} records for date: ${currentDate}`);
    res.json({
      message: 'Weight history retrieved successfully',
      data: weightLogs,
    });
  } catch (error) {
    logger.error('Error fetching weight history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function untuk mendapatkan weight history harian
exports.getDailyWeightHistory = async (req, res) => {
  try {
    const { date } = req.query;
    logger.info(`Fetching daily weight history for date: ${date}`);
    if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
      logger.warn(`Invalid date parameter: ${date}`);
      return res.status(400).json({ message: 'Valid date parameter (YYYY-MM-DD) is required' });
    }

    const startOfDay = moment.tz(date, 'Asia/Jakarta').startOf('day').utc().toDate();
    const endOfDay = moment.tz(date, 'Asia/Jakarta').endOf('day').utc().toDate();
    logger.info(`Query range: ${startOfDay} to ${endOfDay}`);

    const weightLogs = await WeightLog.findAll({
      attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'],
      where: {
        timestamp: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [['timestamp', 'ASC']],
    });

    logger.info(`Found ${weightLogs.length} records for date: ${date}`);
    res.json({
      message: 'Daily weight history retrieved successfully',
      data: weightLogs,
    });
  } catch (error) {
    logger.error(`Error fetching daily weight history for date ${req.query.date}: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function untuk mengirim update real-time via WebSocket
exports.broadcastNewWeight = (newWeightLog) => {
  const logDate = moment.tz(newWeightLog.timestamp, 'Asia/Jakarta').format('YYYY-MM-DD');
  const currentDate = moment.tz('Asia/Jakarta').format('YYYY-MM-DD');

  if (logDate !== currentDate) {
    logger.info(`Skipping WebSocket broadcast for non-current date: ${logDate}`);
    return;
  }

  const payload = JSON.stringify({
    message: 'New weight log entry',
    data: newWeightLog,
  });

  websocketClients.forEach((client, id) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
      logger.info(`Sent WebSocket update to client ${id} for date: ${logDate}`);
    }
  });
};

// Function untuk menambahkan client ke WebSocket list
exports.registerWebSocketClient = (ws) => {
  const currentClientId = ++clientId;
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