"use strict";

var express = require('express');

var net = require('net');

var WebSocket = require('ws');

var app = express();
var apiPort = 3001; // Port untuk API Express

var wsPort = 3002; // Port untuk WebSocket

var vehicleWeight = ''; // Menyimpan data berat kendaraan yang diterima
// Middleware untuk menangani JSON

app.use(express.json()); // Endpoint API untuk mendapatkan data berat kendaraan

app.get('/api/weight', function (req, res) {
  if (vehicleWeight) {
    res.json({
      weight: vehicleWeight
    });
  } else {
    res.status(404).json({
      message: 'Data berat kendaraan belum tersedia'
    });
  }
}); // Menjalankan API di port 3001

app.listen(apiPort, function () {
  console.log("API berjalan di http://localhost:".concat(apiPort));
}); // Setup WebSocket server di port 3002

var wss = new WebSocket.Server({
  port: wsPort
});
wss.on('connection', function (ws) {
  console.log('Client terhubung ke WebSocket'); // Membuat koneksi ke server TCP

  var tcpClient = new net.Socket();
  tcpClient.connect(23, '10.88.0.44', function () {
    console.log('Terhubung ke server TCP');
  }); // Mendengarkan data yang datang dari server TCP

  tcpClient.on('data', function (data) {
    vehicleWeight = data.toString().trim(); // Simpan data berat kendaraan

    console.log('Berat Kendaraan diterima:', vehicleWeight); // Mengirimkan data dalam format JSON ke frontend melalui WebSocket

    ws.send(JSON.stringify({
      weight: vehicleWeight
    })); // Mengirimkan data dalam format JSON
  }); // Menangani penutupan koneksi WebSocket

  ws.on('close', function () {
    console.log('Client WebSocket terputus');
    tcpClient.end();
  }); // Menangani error pada WebSocket

  ws.on('error', function (error) {
    console.error('WebSocket Error:', error);
    tcpClient.end();
  }); // Menangani penutupan koneksi TCP

  tcpClient.on('close', function () {
    console.log('Terputus dari server TCP');
  });
  tcpClient.on('error', function (error) {
    console.error('Error TCP:', error);
  });
});