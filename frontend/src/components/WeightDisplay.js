import React, { useEffect, useState } from 'react';
import { processWeightData, getRawWeightData, getProcessedWeightData } from '../utils/weightUtils'; // Import fungsi global

const WeightDisplay = () => {
  const [weight, setWeight] = useState(null); // Menyimpan berat kendaraan yang sudah diproses
  const [rawWeight, setRawWeight] = useState(null); // Menyimpan data raw
  const [socketError, setSocketError] = useState(null); // Menyimpan error WebSocket
  const [isConnected, setIsConnected] = useState(false); // Menyimpan status koneksi WebSocket

  useEffect(() => {
    // Membuat koneksi WebSocket
    const socket = new WebSocket('ws://localhost:3002');

    // WebSocket onOpen handler
    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true); // Menandakan WebSocket sudah terhubung
    };

    // WebSocket onError handler
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setSocketError('Kesalahan koneksi WebSocket');
    };

    // WebSocket onMessage handler
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Data WebSocket diterima:', data);

      // Menyimpan data raw dan memproses berat kendaraan
      const rawWeightData = data.weight;
      setRawWeight(rawWeightData);

      if (rawWeightData) {
        const processedWeight = processWeightData(rawWeightData);
        setWeight(processedWeight); // Menyimpan nilai berat yang sudah diproses
      }
    };

    // WebSocket onClose handler
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false); // Menandakan WebSocket terputus
    };

    // Cleanup saat komponen unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>

      {/* Menampilkan data raw dari fungsi global */}
      <p>Data raw dari fungsi global: {getRawWeightData()}</p>

      {/* Menampilkan data yang sudah diproses dari fungsi global */}
      <p>Data yang diproses dari fungsi global: {getProcessedWeightData()} Kg</p>
    </div>
  );
};

export default WeightDisplay;
