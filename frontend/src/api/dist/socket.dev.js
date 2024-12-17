"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// src/api/socket.js
var socket = new WebSocket('ws://localhost:3002'); // Ganti port sesuai konfigurasi

var connectWebSocket = function connectWebSocket(onMessage) {
  socket.onopen = function () {
    console.log('WebSocket Connected');
  };

  socket.onmessage = function (event) {
    try {
      var data = JSON.parse(event.data);
      onMessage(data); // Kirim data ke callback
    } catch (err) {
      console.error('Error parsing WebSocket data:', err);
    }
  };

  socket.onclose = function () {
    console.log('WebSocket Disconnected');
  };

  socket.onerror = function (error) {
    console.error('WebSocket Error:', error);
  };
};

var _default = connectWebSocket;
exports["default"] = _default;