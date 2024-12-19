// mweight/frontend/src/components/WeightDisplay.js
import React from 'react';
import useWebSocket from '../hooks/useWebSocket';
import useApi from '../hooks/useApi';

const WeightDisplay = () => {
  const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3002';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/weight';

  const { data: socketData, error: socketError } = useWebSocket(WS_URL);
  const { data: apiData, error: apiError } = useApi(API_URL);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Real-Time Vehicle Weight</h2>

      <div className="row">
        {/* WebSocket Data */}
        <div className="col-md-6">
          <h4>WebSocket Data</h4>
          {socketError && <p className="text-danger">WebSocket Error: {socketError}</p>}
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
          {apiError && <p className="text-danger">API Error: {apiError}</p>}
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
