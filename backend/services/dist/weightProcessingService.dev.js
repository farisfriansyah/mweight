"use strict";

// mweight/backend/services/weightProcessingService.js
exports.processVehicleWeight = function (rawWeight) {
  if (!rawWeight) {
    return null; // Return null if no weight is found
  } // Only extract numbers and decimals, else return null


  var match = rawWeight.match(/[\d\.]+/);

  if (match) {
    var processedWeight = parseFloat(match[0]);
    return processedWeight.toFixed(1); // Return processed weight with 1 decimal
  }

  return null; // Return null if no match is found
};