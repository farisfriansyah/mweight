"use strict";

// mweight/backend/services/weightSavingService.js
var weightProcessingService = require('./weightProcessingService');

var weightHistoryController = require('../controllers/weightHistoryController');

var WeightLog = require('../models/WeightLog');

var logger = require('../utils/logger');

var tcpService = require('../services/tcpService');

var moment = require('moment-timezone'); // Get current timestamp in Asia/Jakarta timezone


var getTimestamp = function getTimestamp() {
  return moment().tz('Asia/Jakarta').format();
};

var timestamp = getTimestamp();
console.log("Current timestamp: ".concat(timestamp)); // Function to save weight data to the database

var saveWeightToDatabase = function saveWeightToDatabase(rawWeight) {
  var weightData, processedWeight, newLog;
  return regeneratorRuntime.async(function saveWeightToDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          logger.info("Received raw weight: ".concat(rawWeight));
          _context.prev = 1;
          weightData = weightProcessingService.processVehicleWeight(rawWeight);
          processedWeight = weightData ? weightData.processedWeight : null;
          _context.next = 6;
          return regeneratorRuntime.awrap(WeightLog.create({
            rawWeight: rawWeight,
            processedWeight: processedWeight,
            createdAt: timestamp
          }));

        case 6:
          newLog = _context.sent;
          logger.info("Data saved to database: ".concat(JSON.stringify(newLog.toJSON()))); // Broadcast data baru ke WebSocket clients

          weightHistoryController.broadcastNewWeight(newLog.toJSON());
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          logger.error("Error while saving to the database: ".concat(_context.t0.message));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}; // Function to automatically fetch and save weight data every minute


var startAutomaticWeightSaving = function startAutomaticWeightSaving() {
  logger.info('Starting automatic weight saving every 60 seconds...');
  setInterval(function _callee() {
    var rawWeight;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(tcpService.getVehicleWeight());

          case 3:
            rawWeight = _context2.sent;

            if (rawWeight) {
              _context2.next = 7;
              break;
            }

            logger.warn('No data received from TCP.');
            return _context2.abrupt("return");

          case 7:
            // Log the raw weight before saving
            logger.info("Saving weight to database... Raw weight: ".concat(rawWeight)); // Save the weight data to the database

            _context2.next = 10;
            return regeneratorRuntime.awrap(saveWeightToDatabase(rawWeight));

          case 10:
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            logger.error("Error fetching data from TCP: ".concat(_context2.t0.message));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 12]]);
  }, 60000); // Set interval to 60 seconds (1 minute)
};

module.exports = {
  saveWeightToDatabase: saveWeightToDatabase,
  startAutomaticWeightSaving: startAutomaticWeightSaving
};