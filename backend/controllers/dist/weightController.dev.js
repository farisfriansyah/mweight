"use strict";

var tcpService = require('../services/tcpService'); // Endpoint untuk mendapatkan data berat kendaraan


exports.getWeight = function (req, res) {
  var weight = tcpService.getVehicleWeight(); // Mendapatkan data berat kendaraan

  if (weight) {
    res.json({
      weight: weight
    }); // Mengirimkan data berat kendaraan dalam format JSON
  } else {
    res.status(404).json({
      message: 'Data berat kendaraan belum tersedia'
    });
  }
};