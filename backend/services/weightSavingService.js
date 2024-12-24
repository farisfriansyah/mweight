// mweight/backend/services/weightSavingService.js

const weightProcessingService = require('./weightProcessingService');
const weightHistoryController = require('../controllers/weightHistoryController');
const WeightLog = require('../models/WeightLog');
const logger = require('../utils/logger');
const tcpService = require('../services/tcpService');
const moment = require('moment-timezone');

// Get current timestamp in Asia/Jakarta timezone
const getTimestamp = () => moment().tz('Asia/Jakarta').format();
const timestamp = getTimestamp(); 
console.log(`Current timestamp: ${timestamp}`);

// Function to save weight data to the database
const saveWeightToDatabase = async (rawWeight) => {
  logger.info(`Received raw weight: ${rawWeight}`);

  try {
    const weightData = weightProcessingService.processVehicleWeight(rawWeight);
    const processedWeight = weightData ? weightData.processedWeight : null;

    const newLog = await WeightLog.create({
      rawWeight: rawWeight,
      processedWeight: processedWeight,
      createdAt: timestamp,
    });

    logger.info(`Data saved to database: ${JSON.stringify(newLog.toJSON())}`);

    // Broadcast data baru ke WebSocket clients
    weightHistoryController.broadcastNewWeight(newLog.toJSON());
  } catch (error) {
    logger.error(`Error while saving to the database: ${error.message}`);
  }
};

// Function to automatically fetch and save weight data every minute
const startAutomaticWeightSaving = () => {
  logger.info('Starting automatic weight saving every 60 seconds...');

  setInterval(async () => {
    try {
      // Fetch raw weight from the TCP service
      const rawWeight = await tcpService.getVehicleWeight();

      if (!rawWeight) {
        logger.warn('No data received from TCP.');
        return;
      }

      // Log the raw weight before saving
      logger.info(`Saving weight to database... Raw weight: ${rawWeight}`);

      // Save the weight data to the database
      await saveWeightToDatabase(rawWeight);

    } catch (error) {
      logger.error(`Error fetching data from TCP: ${error.message}`);
    }
  }, 60000); // Set interval to 60 seconds (1 minute)
};

module.exports = { saveWeightToDatabase, startAutomaticWeightSaving };