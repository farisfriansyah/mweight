import React, { useState, useEffect } from 'react';
import { fetchVehicleWeight } from '../api/api'; // Import API untuk mendapatkan data berat
import { processWeightData } from '../utils/weightUtils'; // Fungsi global untuk memproses data berat

const TimeCapture = () => {
  const [captureData, setCaptureData] = useState([]); // Menyimpan data capture
  const [latestWeight, setLatestWeight] = useState(null); // Menyimpan data berat terbaru yang sudah diproses
  const [fetchError, setFetchError] = useState(null); // Menyimpan error saat mengambil data

  useEffect(() => {
    // Fungsi untuk menangkap data berat kendaraan setiap menit
    const captureDataEveryMinute = async () => {
      try {
        const data = await fetchVehicleWeight(); // Memanggil API untuk mendapatkan data berat

        if (data.weight !== null) {
          const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const currentDate = new Date().toLocaleDateString();
          const processedWeight = processWeightData(data.weight); // Memproses data berat

          // Menyimpan berat terbaru
          setLatestWeight(processedWeight);

          // Menambahkan data ke daftar capture
          setCaptureData((prevData) => [
            ...prevData,
            { date: currentDate, time: currentTime, weight: processedWeight } // Timestamp dari kode
          ]);
        }
      } catch (error) {
        console.error('Error fetching weight:', error);
        setFetchError('Gagal mengambil data berat kendaraan.');
      }
    };

    // Menangkap data setiap menit
    const interval = setInterval(captureDataEveryMinute, 60000);

    // Cleanup interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Time Capture</h3>

      {/* Menampilkan error jika ada */}
      {fetchError && <p className="text-danger">{fetchError}</p>}

      {/* Tabel untuk menampilkan data capture */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Waktu</th>
            <th>Berat (Kg)</th>
          </tr>
        </thead>
        <tbody>
          {captureData.length > 0 ? (
            captureData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.time}</td>
                <td>{entry.weight} Kg</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Belum ada data yang ditangkap.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div>
        <h4>Data Terbaru</h4>
        {/* Menampilkan berat kendaraan terbaru */}
        {latestWeight !== null ? (
          <p>Berat kendaraan: {latestWeight} Kg</p>
        ) : (
          <p>Menunggu data berat kendaraan...</p>
        )}
      </div>
    </div>
  );
};

export default TimeCapture;
