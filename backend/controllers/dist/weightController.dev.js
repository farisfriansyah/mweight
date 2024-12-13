"use strict";

// mweight/backend/controllers/weightController.js
var tcpService = require('../services/tcpService');

exports.getWeight = function (req, res) {
  var weight = tcpService.getVehicleWeight();

  if (weight) {
    res.json({
      weight: weight
    });
  } else {
    res.status(404).json({
      message: 'Data berat kendaraan belum tersedia'
    });
  }
};