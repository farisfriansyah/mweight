"use strict";

var tcpService = require('../services/tcpService'); // Endpoint untuk mendapatkan data berat kendaraan


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
}; // Endpoint untuk menyimpan data berat yang ditangkap


exports.captureWeight = function (req, res) {
  var weight = req.body.weight;

  if (!weight) {
    return res.status(400).json({
      message: 'Berat kendaraan tidak ditemukan'
    });
  } // Di sini kamu bisa menambahkan logic untuk menyimpan data jika diperlukan


  res.status(200).json({
    message: 'Data berat berhasil disimpan',
    weight: weight
  });
};