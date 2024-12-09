"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWebSocketConnection = void 0;

var createWebSocketConnection = function createWebSocketConnection(onMessage, onError, onClose) {
  var socket = new WebSocket('ws://localhost:3002'); // Pastikan URL WebSocket benar

  socket.onopen = function () {
    console.log('WebSocket terhubung');
  };

  socket.onmessage = function (event) {
    try {
      var data = JSON.parse(event.data); // Mengurai data dari server WebSocket

      onMessage(data); // Panggil callback untuk memperbarui state dengan data yang diterima
    } catch (error) {
      onError(new Error('Error saat menerima pesan: ' + error.message));
    }
  };

  socket.onerror = function (error) {
    console.error('WebSocket Error:', error);
    onError(error); // Panggil callback untuk menangani error
  };

  socket.onclose = function () {
    console.log('WebSocket terputus');
    onClose(); // Menangani WebSocket yang terputus
  };

  return socket; // Mengembalikan objek socket untuk pengelolaan lebih lanjut
};

exports.createWebSocketConnection = createWebSocketConnection;