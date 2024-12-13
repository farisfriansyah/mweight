// mweight/backend/app.js

const express = require('express');
const WebSocket = require('ws');
const cors = require('cors'); // Import cors package
const weightRoutes = require('./routes/weightRoutes');
const tcpService = require('./services/tcpService');
const config = require('./config/config');

const app = express();

// Allow all origins or specify the origin of your frontend
app.use(cors({
  origin: 'http://localhost:3000', // Specify your frontend URL
  methods: 'GET,POST', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers for requests
}));

// Middleware untuk menangani JSON
app.use(express.json());

// Menggunakan routes untuk API
app.use('/api', weightRoutes);

// Menjalankan API di port yang ditentukan
app.listen(config.apiPort, () => {
  console.log(`API berjalan di http://localhost:${config.apiPort}`);
});

// Setup WebSocket server di port yang ditentukan
const wss = new WebSocket.Server({ port: config.wsPort });

wss.on('connection', (ws) => {
  console.log('Client terhubung ke WebSocket');

  // Fungsi untuk mengirim data berat kendaraan melalui WebSocket
  const sendWeight = () => {
    const weight = tcpService.getVehicleWeight();
    if (weight) {
      ws.send(JSON.stringify({ weight }));
    }
  };

  // Kirim data berat kendaraan setiap detik
  const interval = setInterval(sendWeight, 1000);

  // Menangani penutupan koneksi WebSocket
  ws.on('close', () => {
    console.log('Client WebSocket terputus');
    clearInterval(interval);
  });

  // Menangani error pada WebSocket
  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
    clearInterval(interval);
  });
});

// Mulai koneksi TCP
tcpService.startTcpConnection(config.tcpHost, config.tcpPort);
