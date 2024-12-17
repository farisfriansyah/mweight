// src/components/TimeCapture.js
import React, { useState, useEffect } from 'react';
import { fetchRHWeight } from '../api/api';
import { processWeightData } from '../utils/weightUtils';

const TimeCapture = () => {
  const [captureData, setCaptureData] = useState([]);
  const [latestWeight, setLatestWeight] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // Fungsi untuk menangkap data berat kendaraan setiap menit
    const captureDataEveryMinute = async () => {
      try {
        const data = await fetchRHWeight();
        if (data.weight !== null) {
          const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const currentDate = new Date().toLocaleDateString();
          const processedWeight = processWeightData(data.weight);

          setLatestWeight(processedWeight);
          setCaptureData((prevData) => [
            ...prevData,
            { date: currentDate, time: currentTime, weight: processedWeight },
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

      {fetchError && <p className="text-danger">{fetchError}</p>}

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