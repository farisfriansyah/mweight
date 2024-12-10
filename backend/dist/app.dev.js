"use strict";

var express = require('express');

var WebSocket = require('ws');

var weightRoutes = require('./routes/weightRoutes');

var tcpService = require('./services/tcpService');

var config = require('./config/config');

var app = express(); // Middleware untuk menangani JSON

app.use(express.json()); // Menggunakan routes untuk API

app.use('/api', weightRoutes); // Menjalankan API di port yang ditentukan

app.listen(config.apiPort, function () {
  console.log("API berjalan di http://localhost:".concat(config.apiPort));
}); // Setup WebSocket server di port yang ditentukan

var wss = new WebSocket.Server({
  port: config.wsPort
});
wss.on('connection', function (ws) {
  console.log('Client terhubung ke WebSocket'); // Fungsi untuk mengirim data berat kendaraan melalui WebSocket

  var sendWeight = function sendWeight() {
    var weight = tcpService.getVehicleWeight();

    if (weight) {
      ws.send(JSON.stringify({
        weight: weight
      }));
    }
  }; // Kirim data berat kendaraan setiap detik


  var interval = setInterval(sendWeight, 1000); // Menangani penutupan koneksi WebSocket

  ws.on('close', function () {
    console.log('Client WebSocket terputus');
    clearInterval(interval);
  }); // Menangani error pada WebSocket

  ws.on('error', function (error) {
    console.error('WebSocket Error:', error);
    clearInterval(interval);
  });
}); // Mulai koneksi TCP

tcpService.startTcpConnection(config.tcpHost, config.tcpPort);