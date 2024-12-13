// mweight/backend/controllers/weightController.js
const tcpService = require('../services/tcpService');

exports.getWeight = (req, res) => {
  const weight = tcpService.getVehicleWeight();
  if (weight) {
    res.json({ weight });
  } else {
    res.status(404).json({ message: 'Data berat kendaraan belum tersedia' });
  }
};
