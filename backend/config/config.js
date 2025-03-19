// mweight/backend/config/config.js
require('dotenv').config(); // Memuat variabel dari .env

module.exports = {
    tcpHost: process.env.TCP_HOST || '127.0.0.1', // Default jika variabel tidak ada
    tcpPort: parseInt(process.env.TCP_PORT, 10) || 23,
    wsPort: parseInt(process.env.WS_PORT, 10) || 3002,
    urlHost: parseInt(process.env.URL_HOST, 10) || 'localhost',
    apiPort: parseInt(process.env.API_PORT, 10) || 3001,
    logsPort: parseInt(process.env.LOGS_PORT, 10) || 3004,
  };