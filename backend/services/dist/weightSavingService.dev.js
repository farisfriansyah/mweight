"use strict";

// mweight/backend/services/weightSavingService.js
require('dotenv').config(); // Memuat variabel lingkungan dari .env file


var config = require('../config/config'); // Import konfigurasi dari config.js


var weightProcessingService = require('./weightProcessingService'); // Import fungsi pemrosesan berat kendaraan


var createDbConnection = require('../config/db'); // Import fungsi koneksi dari dbConnection.js
// Fungsi untuk menyimpan data berat kendaraan ke database dengan tanggal dan jam terpisah


var saveWeightToDatabase = function saveWeightToDatabase(rawWeight) {
  var processedWeight, currentDateTime, date, time, query, connection;
  return regeneratorRuntime.async(function saveWeightToDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          processedWeight = weightProcessingService.processVehicleWeight(rawWeight);

          if (!(processedWeight === null)) {
            _context.next = 4;
            break;
          }

          console.error('Berat kendaraan tidak valid');
          return _context.abrupt("return");

        case 4:
          currentDateTime = new Date();
          date = currentDateTime.toISOString().slice(0, 10);
          time = currentDateTime.toISOString().slice(11, 19);
          query = 'INSERT INTO weight_logs (weight, date, time) VALUES (?, ?, ?)';
          connection = createDbConnection();
          _context.prev = 9;
          console.log('Menyimpan data ke database:', {
            processedWeight: processedWeight,
            date: date,
            time: time
          });
          _context.next = 13;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            connection.query(query, [processedWeight, date, time], function (err, results) {
              if (err) {
                console.error('Error menyimpan data ke database:', err.message);
                reject(err);
              } else {
                console.log('Data berat berhasil disimpan ke database:', results);
                resolve(results);
              }
            });
          }));

        case 13:
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](9);
          console.error('Terjadi kesalahan saat menyimpan data:', _context.t0.message);

        case 18:
          _context.prev = 18;
          connection.end();
          return _context.finish(18);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[9, 15, 18, 21]]);
}; // Fungsi untuk mengambil dan menyimpan data berat setiap menit


var startAutomaticWeightSaving = function startAutomaticWeightSaving() {
  // Mengambil rawWeight dari sumber tertentu, misalnya sensor atau layanan lain.
  // Di sini saya menggunakan nilai contoh 1000 sebagai rawWeight untuk demonstrasi.
  var rawWeight = 1000; // Ganti dengan data dari sensor atau sumber lain
  // Simpan data berat kendaraan setiap menit

  setInterval(function () {
    console.log('Saving weight to database...');
    saveWeightToDatabase(rawWeight);
  }, 60000); // 60000 ms = 1 menit
}; // Memulai proses penyimpanan otomatis setiap menit


startAutomaticWeightSaving();
module.exports = {
  saveWeightToDatabase: saveWeightToDatabase
};