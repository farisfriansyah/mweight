"use strict";

var express = require('express');

var WebSocket = require('ws');

var weightRoutes = require('./routes/weightRoutes');

var tcpService = require('./services/tcpService');

var config = require('./config/config');

var cors = require('cors');

var app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000' // Izinkan hanya dari frontend di localhost:3000

})); // Middleware untuk menangani JSON

app.use(express.json()); // Menggunakan routes untuk API

app.use('/api', weightRoutes); // Menjalankan API di port 3001

app.listen(config.apiPort, function () {
  console.log("API berjalan di http://localhost:".concat(config.apiPort));
}); // Setup WebSocket server di port 3002

var wss = new WebSocket.Server({
  port: config.wsPort
});
wss.on('connection', function (ws) {
  console.log('Client terhubung ke WebSocket'); // Mengirimkan data berat kendaraan melalui WebSocket ketika data tersedia

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