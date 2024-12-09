// src/api/api.js
export const fetchVehicleWeight = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/weight');  // Pastikan URL API benar
    if (!response.ok) {
      throw new Error('Gagal mengambil data berat kendaraan');
    }
    return await response.json();  // Mengembalikan hasil respons API dalam format JSON
  } catch (error) {
    throw error;  // Menangani error jika terjadi kegagalan dalam mengambil data
  }
};

export const saveCapturedWeight = async (weightData) => {
  try {
    const response = await fetch('http://localhost:3001/api/weight/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weightData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error menyimpan data berat:', error);
    throw error;
  }
};


