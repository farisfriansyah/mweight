"use strict";

// mweight/backend/config/config.js
require('dotenv').config(); // Memuat variabel dari .env


module.exports = {
  wsPort: parseInt(process.env.WS_PORT, 10) || 3002,
  urlHost: parseInt(process.env.URL_HOST, 10) || 'localhost',
  apiPort: parseInt(process.env.API_PORT, 10) || 3001,
  logsPort: parseInt(process.env.LOGS_PORT, 10) || 3004,
  timeZone: parseInt(process.env.TZ, 10) || 3004
};