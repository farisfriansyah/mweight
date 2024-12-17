// src/api/socket.js
const socket = new WebSocket('ws://localhost:3002'); // Ganti port sesuai konfigurasi

const connectWebSocket = (onMessage) => {
  socket.onopen = () => {
    console.log('WebSocket Connected');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data); // Kirim data ke callback
    } catch (err) {
      console.error('Error parsing WebSocket data:', err);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket Disconnected');
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };
};

export default connectWebSocket;
