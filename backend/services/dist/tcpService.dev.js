"use strict";

var net = require('net');

var vehicleWeight = null; // Menyimpan data berat kendaraan

var client = null;
var retryAttempts = 0;
var maxRetryAttempts = 5; // Maksimum percobaan retry

var retryDelay = 5000; // Delay 5 detik antara percobaan retry
// Fungsi untuk memulai koneksi TCP

exports.startTcpConnection = function (host, port) {
  var connectTcp = function connectTcp() {
    client = new net.Socket();
    client.connect(port, host, function () {
      console.log("Terhubung ke server TCP di ".concat(host, ":").concat(port)); // Perbaiki template string

      retryAttempts = 0; // Reset retry jika koneksi berhasil
    });
    client.on('data', function (data) {
      // Menyimpan data berat kendaraan yang diterima
      vehicleWeight = data.toString().trim();
      console.log('Data berat kendaraan diterima:', vehicleWeight);
    });
    client.on('close', function () {
      console.log('Koneksi TCP ditutup');
      retryConnection(); // Coba untuk reconnect
    });
    client.on('error', function (err) {
      console.error('Error koneksi TCP:', err);
      retryConnection(); // Coba untuk reconnect jika terjadi error
    });
  }; // Fungsi untuk mencoba reconnect setelah koneksi terputus


  var retryConnection = function retryConnection() {
    if (retryAttempts < maxRetryAttempts) {
      console.log("Mencoba reconnect... (Percobaan: ".concat(retryAttempts + 1, ")")); // Perbaiki template string

      retryAttempts++;
      setTimeout(function () {
        connectTcp(); // Coba reconnect setelah delay
      }, retryDelay);
    } else {
      console.error('Gagal reconnect setelah beberapa percobaan.');
    }
  };

  connectTcp(); // Pertama kali mencoba menghubungkan
}; // Fungsi untuk mengambil data berat kendaraan


exports.getVehicleWeight = function () {
  return vehicleWeight; // Mengembalikan data berat kendaraan yang diterima
}; // Fungsi untuk menghentikan koneksi TCP (jika perlu)


exports.stopTcpConnection = function () {
  if (client) {
    client.end(function () {
      console.log('Koneksi TCP ditutup');
    });
  }
};