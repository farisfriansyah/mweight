"use strict";

var net = require('net');

var vehicleWeight = null; // Menyimpan data berat kendaraan
// Fungsi untuk memulai koneksi TCP

exports.startTcpConnection = function (host, port) {
  var client = new net.Socket();
  client.connect(port, host, function () {
    console.log("Terhubung ke server TCP di ".concat(host, ":").concat(port));
  });
  client.on('data', function (data) {
    // Menyimpan data berat kendaraan yang diterima
    vehicleWeight = data.toString().trim();
    console.log('Data berat kendaraan diterima:', vehicleWeight);
  });
  client.on('close', function () {
    console.log('Koneksi TCP ditutup');
  });
  client.on('error', function (err) {
    console.error('Error koneksi TCP:', err);
  });
}; // Fungsi untuk mengambil data berat kendaraan


exports.getVehicleWeight = function () {
  return vehicleWeight; // Mengembalikan data berat kendaraan yang diterima
};