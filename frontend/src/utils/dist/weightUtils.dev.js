"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProcessedWeightData = exports.getRawWeightData = exports.processWeightData = void 0;
var rawWeightData = null; // Variabel global untuk menyimpan data raw

var processedWeightData = null; // Variabel global untuk menyimpan data yang sudah diproses
// Fungsi untuk memproses data berat kendaraan (mengambil nilai angka saja dan menghilangkan nol depan)

var processWeightData = function processWeightData(rawData) {
  // Mengambil hanya angka dan titik desimal (jika ada)
  var weightValue = rawData.replace(/[^\d.-]/g, ''); // Menghilangkan angka nol di depan jika ada dan memastikan angka yang valid

  var processedWeight = parseFloat(weightValue).toFixed(1); // Membatasi desimal hingga satu angka

  rawWeightData = rawData; // Simpan data raw

  processedWeightData = processedWeight; // Simpan data yang sudah diproses

  return processedWeight;
}; // Fungsi untuk mendapatkan data raw terakhir


exports.processWeightData = processWeightData;

var getRawWeightData = function getRawWeightData() {
  return rawWeightData; // Mengembalikan data raw yang disimpan
}; // Fungsi untuk mendapatkan data yang sudah diproses


exports.getRawWeightData = getRawWeightData;

var getProcessedWeightData = function getProcessedWeightData() {
  return processedWeightData; // Mengembalikan data yang sudah diproses
};

exports.getProcessedWeightData = getProcessedWeightData;