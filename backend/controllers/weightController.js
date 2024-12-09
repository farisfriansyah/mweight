const tcpService = require('../services/tcpService');

// Endpoint untuk mendapatkan data berat kendaraan
exports.getWeight = (req, res) => {
  const weight = tcpService.getVehicleWeight(); // Mendapatkan data berat kendaraan
  if (weight) {
    res.json({ weight }); // Mengirimkan data berat kendaraan dalam format JSON
  } else {
    res.status(404).json({ message: 'Data berat kendaraan belum tersedia' });
  }
};
