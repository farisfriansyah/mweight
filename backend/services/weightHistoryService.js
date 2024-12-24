// mweight/backend/services/weightHistoryService.js
const WeightLog = require('../models/WeightLog');
const logger = require('../utils/logger');

// Fungsi untuk mengambil data berat terbaru dari database
const fetchWeightHistory = async () => {
  try {
    // Ambil 200 data terbaru berdasarkan timestamp
    const weightHistory = await WeightLog.findAll({
      attributes: ['id', 'rawWeight', 'processedWeight', 'timestamp'],
      order: [['timestamp', 'DESC']],
      limit: 200,
    });

    return weightHistory.map(entry => entry.toJSON()); // Kembalikan sebagai JSON
  } catch (error) {
    logger.error(`Error fetching weight history: ${error.message}`);
    throw error;
  }
};

// Fungsi untuk memantau perubahan pada tabel dan memperbarui data jika ada yang baru
const watchWeightHistory = (callback) => {
  let latestTimestamp = null;

  const fetchAndUpdate = async () => {
    try {
      const weightHistory = await fetchWeightHistory();

      if (weightHistory.length > 0) {
        const newLatestTimestamp = weightHistory[0].timestamp;

        // Periksa apakah ada pembaruan data
        if (!latestTimestamp || newLatestTimestamp > latestTimestamp) {
          latestTimestamp = newLatestTimestamp;
          callback(weightHistory); // Panggil callback dengan data terbaru
        }
      }
    } catch (error) {
      logger.error(`Error watching weight history: ${error.message}`);
    }
  };

  // Jalankan secara berkala setiap detik
  setInterval(fetchAndUpdate, 1000);
};

module.exports = { fetchWeightHistory, watchWeightHistory };
