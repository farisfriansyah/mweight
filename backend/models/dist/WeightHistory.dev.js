"use strict";

WeightHistory.afterCreate(function (newHistory, options) {
  // Setelah baris baru dibuat, kirimkan data melalui API dan WebSocket
  var weightHistoryData = newHistory.toJSON(); // Kirim data terbaru melalui API (bisa ditambahkan di weightController)
  // Kirim melalui WebSocket (misalnya di app.js atau server WebSocket lainnya)
  // Kamu dapat menggunakan WebSocket server untuk broadcast data ke semua client yang terhubung

  if (global.wsClients && global.wsClients.length > 0) {
    global.wsClients.forEach(function (client) {
      client.send(JSON.stringify([weightHistoryData]));
    });
  }
});