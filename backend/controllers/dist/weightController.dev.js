"use strict";

// mweight/backend/controllers/weightController.js
var tcpService = require('../services/tcpService');

var weightProcessingService = require('../services/weightProcessingService');

var moment = require('moment-timezone'); // Fungsi untuk menangani request API (HTTP)


exports.getWeightApi = function (req, res) {
  // Ambil raw weight dari tcpService
  var rawWeight = tcpService.getVehicleWeight();

  if (!rawWeight) {
    return res.status(404).json({
      message: 'Data berat kendaraan belum tersedia'
    });
  } // Proses raw weight untuk mendapatkan processed weight


  var weightData = weightProcessingService.processVehicleWeight(rawWeight);
  var timestamp = moment().tz('Asia/Jakarta').format(); // Tambahkan timestamp
  // Jika berat tidak valid setelah diproses

  if (!weightData) {
    return res.status(400).json({
      message: 'Berat kendaraan tidak valid'
    });
  } // Kirim respons API dengan data yang benar


  res.json({
    rawWeight: rawWeight,
    // Data mentah (rawWeight)
    processedWeight: weightData.processedWeight,
    // Data yang sudah diproses
    timestamp: timestamp // Menyertakan timestamp

  });
}; // Fungsi untuk mengirim data via WebSocket


exports.sendRealTimeData = function (ws) {
  // Ambil raw weight dari tcpService
  var rawWeight = tcpService.getVehicleWeight();

  if (!rawWeight) {
    return;
  } // Proses raw weight untuk mendapatkan processed weight


  var weightData = weightProcessingService.processVehicleWeight(rawWeight);
  var timestamp = moment().tz('Asia/Jakarta').format(); // Tambahkan timestamp
  // Jika berat tidak valid setelah diproses

  if (!weightData) {
    return;
  } // Kirim data melalui WebSocket


  ws.send(JSON.stringify({
    rawWeight: rawWeight,
    // Data mentah (rawWeight)
    processedWeight: weightData.processedWeight,
    // Data yang sudah diproses
    timestamp: timestamp // Menyertakan timestamp

  }));
};