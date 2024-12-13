require('dotenv').config();  // Memuat variabel lingkungan dari .env file
const config = require('../config/config'); // Import konfigurasi dari config.js
const weightProcessingService = require('./weightProcessingService'); // Import fungsi pemrosesan berat kendaraan
const createDbConnection = require('../config/db'); // Import fungsi koneksi dari dbConnection.js

// Fungsi untuk menyimpan data berat kendaraan ke database dengan tanggal dan jam terpisah
const saveWeightToDatabase = async (rawWeight) => {
    const processedWeight = weightProcessingService.processVehicleWeight(rawWeight);

    console.log('Processed Weight:', processedWeight);
  
    if (processedWeight === null) {
      console.error('Berat kendaraan tidak valid');
      return;
    }
  
    const currentDateTime = new Date();
    const date = currentDateTime.toISOString().slice(0, 10);
    const time = currentDateTime.toISOString().slice(11, 19);
  
    console.log('Date:', date);
    console.log('Time:', time);
  
    const query = 'INSERT INTO weight_logs (weight, date, time) VALUES (?, ?, ?)';
  
    const connection = createDbConnection();
  
    try {
      // Gunakan Promise untuk menangani query secara efisien
      await new Promise((resolve, reject) => {
        connection.query(query, [processedWeight, date, time], (err, results) => {
          if (err) {
            reject(`Error menyimpan data ke database: ${err}`);
          } else {
            console.log('Data berat berhasil disimpan ke database:', results);
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error('Terjadi kesalahan saat menyimpan data:', error);
    } finally {
      connection.end();
    }
};

// Fungsi untuk mengambil dan menyimpan data berat setiap menit
const startAutomaticWeightSaving = () => {
  // Mengambil rawWeight dari sumber tertentu, misalnya sensor atau layanan lain.
  // Di sini saya menggunakan nilai contoh 1000 sebagai rawWeight untuk demonstrasi.
  const rawWeight = 1000; // Ganti dengan data dari sensor atau sumber lain

  // Simpan data berat kendaraan setiap menit
  setInterval(() => {
    console.log('Saving weight to database...');
    saveWeightToDatabase(rawWeight);
  }, 60000); // 60000 ms = 1 menit
};

// Memulai proses penyimpanan otomatis setiap menit
startAutomaticWeightSaving();

module.exports = { saveWeightToDatabase };
