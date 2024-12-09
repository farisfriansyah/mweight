const express = require('express');
const WebSocket = require('ws');
const weightRoutes = require('./routes/weightRoutes');
const tcpService = require('./services/tcpService');
const config = require('./config/config');
const cors = require('cors');


const app = express();


app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000'  // Izinkan hanya dari frontend di localhost:3000
}));

// Middleware untuk menangani JSON
app.use(express.json());

// Menggunakan routes untuk API
app.use('/api', weightRoutes);

// Menjalankan API di port 3001
app.listen(config.apiPort, () => {
  console.log(`API berjalan di http://localhost:${config.apiPort}`);
});

// Setup WebSocket server di port 3002
const wss = new WebSocket.Server({ port: config.wsPort });

wss.on('connection', (ws) => {
  console.log('Client terhubung ke WebSocket');

  // Mengirimkan data berat kendaraan melalui WebSocket ketika data tersedia
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
