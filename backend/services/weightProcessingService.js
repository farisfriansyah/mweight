// mweight/backend/services/weightProcessingService.js

exports.processVehicleWeight = (rawWeight) => {
  if (!rawWeight) {
    return null; // Return null if no weight is found
  }

  // Pastikan rawWeight yang diterima adalah dalam format string
  const rawWeightStr = rawWeight.toString().trim(); // Menghilangkan spasi yang tidak diperlukan

  // Cek apakah rawWeight mengandung angka yang diinginkan
  const match = rawWeightStr.match(/([+-]?\d{1,3},\d{3}|\+?\d+(\.\d+)?)(?=Kg)/); // Menemukan angka yang diikuti oleh "Kg"

  if (match) {
    // Ambil angka yang ditemukan dan format untuk processedWeight
    const processedWeight = parseFloat(match[0].replace(",", "")).toFixed(1); // Menghapus koma jika ada dan mengonversinya ke format yang benar
    return {
      rawWeight: rawWeight, // Return rawWeight as string
      processedWeight: processedWeight, // Return processedWeight as string
    };
  }

  // Return null jika format tidak sesuai
  return null;
};