let rawWeightData = null; // Variabel global untuk menyimpan data raw
let processedWeightData = null; // Variabel global untuk menyimpan data yang sudah diproses

// Fungsi untuk memproses data berat kendaraan (mengambil nilai angka saja dan menghilangkan nol depan)
export const processWeightData = (rawData) => {
  // Mengambil hanya angka dan titik desimal (jika ada)
  const weightValue = rawData.replace(/[^\d.-]/g, '');
  
  // Menghilangkan angka nol di depan jika ada dan memastikan angka yang valid
  const processedWeight = parseFloat(weightValue).toFixed(1); // Membatasi desimal hingga satu angka
  
  rawWeightData = rawData; // Simpan data raw
  processedWeightData = processedWeight; // Simpan data yang sudah diproses
  
  return processedWeight;
};

// Fungsi untuk mendapatkan data raw terakhir
export const getRawWeightData = () => {
  return rawWeightData; // Mengembalikan data raw yang disimpan
};

// Fungsi untuk mendapatkan data yang sudah diproses
export const getProcessedWeightData = () => {
  return processedWeightData; // Mengembalikan data yang sudah diproses
};
