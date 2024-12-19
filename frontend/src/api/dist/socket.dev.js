"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// mweight/frontend/src/api/socket.js
var connectWebSocket = function connectWebSocket(onMessage, onError) {
  var WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3002';
  var socket = new WebSocket(WS_URL);

  socket.onopen = function () {
    console.log('WebSocket Connected');
  };

  socket.onmessage = function (event) {
    try {
      var data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('Error parsing WebSocket data:', err);
    }
  };

  socket.onclose = function () {
    console.log('WebSocket Disconnected. Reconnecting...');
    setTimeout(function () {
      return connectWebSocket(onMessage, onError);
    }, 5000); // Retry on disconnect
  };

  socket.onerror = function (error) {
    console.error('WebSocket Error:', error);
    onError && onError(error);
  };
};

var _default = connectWebSocket;
exports["default"] = _default;