// src/components/WeightDisplay.js
import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../api/socket'; // Import hook WebSocket
import { processWeightData, getRawWeightData, getProcessedWeightData } from '../utils/weightUtils';

const WeightDisplay = () => {
  const [weight, setWeight] = useState(null);
  const [rawWeight, setRawWeight] = useState(null);
  const [socketError, setSocketError] = useState(null);

  const handleMessage = useCallback((data) => {
    const rawWeightData = data.weight;
    setRawWeight(rawWeightData);

    if (rawWeightData) {
      const processedWeight = processWeightData(rawWeightData);
      setWeight(processedWeight);
    }
  }, []);

  const handleError = useCallback((error) => {
    setSocketError('Kesalahan koneksi WebSocket');
  }, []);

  const handleClose = useCallback(() => {
    console.log('WebSocket terputus');
  }, []);

  // Menggunakan hook untuk mengelola koneksi WebSocket
  const { isConnected } = useWebSocket('ws://localhost:3002', handleMessage, handleError, handleClose);

  return (
    <div>
      <h4>Monitoring Berat Kendaraan</h4>
      
      {/* Menampilkan status koneksi WebSocket */}
      <p>Status WebSocket: {isConnected ? 'Terhubung' : 'Terputus'}</p>
      
      {/* Menampilkan pesan error jika ada */}
      {socketError && <p className="text-danger">{socketError}</p>}

      {/* Menampilkan data raw dari fungsi global */}
      <p>Data raw: {getRawWeightData()}</p>

      {/* Menampilkan data yang sudah diproses */}
      <p>Data yang diproses: {getProcessedWeightData()} Kg</p>
    </div>
  );
};

export default WeightDisplay;
