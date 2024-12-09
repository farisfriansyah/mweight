"use strict";

var net = require('net');

var vehicleWeight = ''; // Fungsi untuk mengambil berat kendaraan

var getVehicleWeight = function getVehicleWeight() {
  return vehicleWeight;
}; // Fungsi untuk memulai koneksi TCP dan menerima data berat kendaraan


var startTcpConnection = function startTcpConnection(host, port) {
  var tcpClient = new net.Socket(); // Menghubungkan ke server TCP

  tcpClient.connect(port, host, function () {
    console.log('Terhubung ke server TCP');
  }); // Mendengarkan data dari server TCP

  tcpClient.on('data', function (data) {
    vehicleWeight = data.toString().trim(); // Menyimpan data berat kendaraan

    console.log('Berat Kendaraan diterima:', vehicleWeight);
  }); // Menangani error dan penutupan koneksi

  tcpClient.on('error', function (error) {
    console.error('Error TCP:', error);
  });
  tcpClient.on('close', function () {
    console.log('Terputus dari server TCP');
  });
};

module.exports = {
  getVehicleWeight: getVehicleWeight,
  startTcpConnection: startTcpConnection
};