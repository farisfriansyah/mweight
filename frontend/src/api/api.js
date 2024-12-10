const API_BASE_URL = 'http://localhost:3001/api';

// Fungsi untuk mengambil data berat kendaraan
export const fetchVehicleWeight = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/weight`);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saat mengambil data berat:', error);
    throw error; // Meneruskan error untuk ditangani di komponen
  }
};

// Fungsi untuk menyimpan data berat yang ditangkap
export const saveCapturedWeight = async (weightData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/weight/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weightData),
    });
    if (!response.ok) {
      throw new Error(`Gagal menyimpan data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saat menyimpan data berat:', error);
    throw error;
  }
};
