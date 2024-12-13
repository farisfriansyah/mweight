// mweight/backend/services/weightProcessingService.js

exports.processVehicleWeight = (rawWeight) => {
  if (!rawWeight) {
    return null; // Return null if no weight is found
  }

  // Only extract numbers and decimals, else return null
  const match = rawWeight.match(/[\d\.]+/);
  if (match) {
    const processedWeight = parseFloat(match[0]);
    return processedWeight.toFixed(1); // Return processed weight with 1 decimal
  }

  return null; // Return null if no match is found
};
