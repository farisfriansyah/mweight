// mweight/backend/controllers/weightController.js
const tcpService = require('../services/tcpService');
const weightProcessingService = require('../services/weightProcessingService');

exports.getWeight = (req, res) => {
  // Ambil raw weight dari tcpService
  const weight = tcpService.getVehicleWeight();

  if (!weight) {
    return res.status(404).json({ message: 'Data berat kendaraan belum tersedia' });
  }

  // Proses raw weight untuk mendapatkan processed weight
  const processedWeight = weightProcessingService.processVehicleWeight(weight);

  // Jika berat tidak valid setelah diproses
  if (processedWeight === null) {
    return res.status(400).json({ message: 'Berat kendaraan tidak valid' });
  }

  // Kirim respons API dengan data tambahan
  res.json({
    weight,          // Data mentah
    processedWeight,    // Data yang sudah diproses
  });
};

