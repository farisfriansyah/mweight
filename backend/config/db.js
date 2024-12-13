// mweight/backend/config/db.js

require('dotenv').config(); // Memuat variabel dari .env file
const mysql = require('mysql2');
const config = require('../config/config'); // Tambahkan import config.js

const createDbConnection = () => {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST || config.dbHost, // Perbaiki akses config
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || config.dbPort || 3306,
    });
  
    connection.connect(err => {
      if (err) {
        console.error('Error connecting to database:', err);
      } else {
        console.log('Connected to database');
      }
    });
  
    return connection;
};

module.exports = createDbConnection;
