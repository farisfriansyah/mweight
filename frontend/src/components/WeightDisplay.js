// src/components/WeightDisplay.js
import React, { useEffect, useState } from 'react';
import connectWebSocket from '../api/socket';
import { fetchWeightData } from '../api/api';

const WeightDisplay = () => {
  const [socketData, setSocketData] = useState(null); // Data dari WebSocket
  const [apiData, setApiData] = useState(null);       // Data dari API

  // WebSocket Connection
  useEffect(() => {
    connectWebSocket((data) => setSocketData(data)); // Update data dari WebSocket
  }, []);

  // Fetch API Data setiap detik
  useEffect(() => {
    const fetchDataInterval = setInterval(async () => {
      const apiResult = await fetchWeightData();
      if (apiResult) setApiData(apiResult); // Update state dengan hasil API
    }, 1000); // Update setiap 1 detik

    return () => clearInterval(fetchDataInterval); // Bersihkan interval
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Real-Time Vehicle Weight</h2>

      <div className="row">
        {/* WebSocket Data */}
        <div className="col-md-6">
          <h4>WebSocket Data</h4>
          {socketData ? (
            <ul className="list-group">
              <li className="list-group-item">Raw Weight: {socketData.rawWeight}</li>
              <li className="list-group-item">Processed Weight: {socketData.processedWeight} Kg</li>
              <li className="list-group-item">Timestamp: {socketData.timestamp}</li>
            </ul>
          ) : (
            <p>Waiting for WebSocket data...</p>
          )}
        </div>

        {/* API Data */}
        <div className="col-md-6">
          <h4>API Data</h4>
          {apiData ? (
            <ul className="list-group">
              <li className="list-group-item">Raw Weight: {apiData.rawWeight}</li>
              <li className="list-group-item">Processed Weight: {apiData.processedWeight} Kg</li>
              <li className="list-group-item">Timestamp: {apiData.timestamp}</li>
            </ul>
          ) : (
            <p>Fetching API data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightDisplay;
