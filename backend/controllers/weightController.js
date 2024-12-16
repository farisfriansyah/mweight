// mweight/backend/controllers/weightController.js
const tcpService = require('../services/tcpService');
const weightProcessingService = require('../services/weightProcessingService');
const moment = require('moment-timezone');

exports.getWeight = (req, res) => {
  // Ambil raw weight dari tcpService
  const weight = tcpService.getVehicleWeight();

  if (!weight) {
    return res.status(404).json({ message: 'Data berat kendaraan belum tersedia' });
  }

  // Proses raw weight untuk mendapatkan processed weight
  const weightData = weightProcessingService.processVehicleWeight(weight);

  const timestamp = moment().tz('Asia/Jakarta').format(); // Tambahkan timestamp

  // Jika berat tidak valid setelah diproses
  if (!weightData) {
    return res.status(400).json({ message: 'Berat kendaraan tidak valid' });
  }

  // Kirim respons API dengan data yang benar
  res.json({
    weight: weight,          // Data mentah (rawWeight)
    processedWeight: weightData.processedWeight,  // Data yang sudah diproses
    timestamp: timestamp,
  });
};