// mweight/backend/controllers/weightController.js
const tcpService = require('../services/tcpService');
const weightProcessingService = require('../services/weightProcessingService');
const moment = require('moment-timezone');

// Fungsi untuk menangani request API (HTTP)
exports.getWeightApi = (req, res) => {
  // Ambil raw weight dari tcpService
  const rawWeight = tcpService.getVehicleWeight();

  if (!rawWeight) {
    return res.status(404).json({ message: 'Data berat kendaraan belum tersedia' });
  }

  // Proses raw weight untuk mendapatkan processed weight
  const weightData = weightProcessingService.processVehicleWeight(rawWeight);

  const timestamp = moment().tz('Asia/Jakarta').format(); // Tambahkan timestamp

  // Jika berat tidak valid setelah diproses
  if (!weightData) {
    return res.status(400).json({ message: 'Berat kendaraan tidak valid' });
  }

  // Kirim respons API dengan data yang benar
  res.json({
    rawWeight: rawWeight,          // Data mentah (rawWeight)
    processedWeight: weightData.processedWeight,  // Data yang sudah diproses
    timestamp: timestamp,  // Menyertakan timestamp
  });
};

// Fungsi untuk mengirim data via WebSocket
exports.sendRealTimeData = (ws) => {
  // Ambil raw weight dari tcpService
  const rawWeight = tcpService.getVehicleWeight();

  if (!rawWeight) {
    return;
  }

  // Proses raw weight untuk mendapatkan processed weight
  const weightData = weightProcessingService.processVehicleWeight(rawWeight);

  const timestamp = moment().tz('Asia/Jakarta').format(); // Tambahkan timestamp

  // Jika berat tidak valid setelah diproses
  if (!weightData) {
    return;
  }

  // Kirim data melalui WebSocket
  ws.send(JSON.stringify({
    rawWeight: rawWeight,          // Data mentah (rawWeight)
    processedWeight: weightData.processedWeight,  // Data yang sudah diproses
    timestamp: timestamp,  // Menyertakan timestamp
  }));
};