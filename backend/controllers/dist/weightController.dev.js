"use strict";

// mweight/backend/controllers/weightController.js
var tcpService = require('../services/tcpService');

var weightProcessingService = require('../services/weightProcessingService');

exports.getWeight = function (req, res) {
  // Ambil raw weight dari tcpService
  var rawWeight = tcpService.getVehicleWeight();

  if (!rawWeight) {
    return res.status(404).json({
      message: 'Data berat kendaraan belum tersedia'
    });
  } // Proses raw weight untuk mendapatkan processed weight


  var processedWeight = weightProcessingService.processVehicleWeight(rawWeight); // Jika berat tidak valid setelah diproses

  if (processedWeight === null) {
    return res.status(400).json({
      message: 'Berat kendaraan tidak valid'
    });
  } // Kirim respons API dengan data tambahan


  res.json({
    rawWeight: rawWeight,
    // Data mentah
    processedWeight: processedWeight // Data yang sudah diproses

  });
};