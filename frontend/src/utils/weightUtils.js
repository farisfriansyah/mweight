// src/utils/weightUtils.js
let rawWeightData = null;
let processedWeightData = null;

// Fungsi untuk memproses data berat kendaraan
export const processWeightData = (rawData) => {
  const weightValue = rawData.replace(/[^\d.-]/g, '');
  const processedWeight = parseFloat(weightValue).toFixed(1);

  rawWeightData = rawData;
  processedWeightData = processedWeight;

  return processedWeight;
};

export const getRawWeightData = () => rawWeightData;
export const getProcessedWeightData = () => processedWeightData;
