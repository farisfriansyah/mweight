"use strict";

// mweight/backend/controllers/weightController.js
var tcpService = require('../services/tcpService');

var weightProcessingService = require('../services/weightProcessingService');

var moment = require('moment-timezone');

exports.getWeight = function (req, res) {
  // Ambil raw weight dari tcpService
  var weight = tcpService.getVehicleWeight();

  if (!weight) {
    return res.status(404).json({
      message: 'Data berat kendaraan belum tersedia'
    });
  } // Proses raw weight untuk mendapatkan processed weight


  var weightData = weightProcessingService.processVehicleWeight(weight);
  var timestamp = moment().tz('Asia/Jakarta').format(); // Tambahkan timestamp
  // Jika berat tidak valid setelah diproses

  if (!weightData) {
    return res.status(400).json({
      message: 'Berat kendaraan tidak valid'
    });
  } // Kirim respons API dengan data yang benar


  res.json({
    weight: weight,
    // Data mentah (rawWeight)
    processedWeight: weightData.processedWeight,
    // Data yang sudah diproses
    timestamp: timestamp
  });
};