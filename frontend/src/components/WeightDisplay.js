// mweight/frontend/src/components/WeightDisplay.js
import React from 'react';
import useWebSocket from '../hooks/useWebSocket';
import useApi from '../hooks/useApi';

const WeightDisplay = ({ dataSource }) => {
  const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3002';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/weight';

  const { data: socketData, error: socketError } = useWebSocket(WS_URL);
  const { data: apiData, error: apiError } = useApi(API_URL);

  // Select data based on the data source
  const selectedData = dataSource === 'api' ? apiData : socketData;

  return (
    <div className="container mt-4">
      <h2 className="text-center">Real-Time Vehicle Weight</h2>

      <div className="row">
        {/* Display data based on selected source */}
        <div className="col-md-12">
          <h4>{dataSource === 'api' ? 'API Data' : 'WebSocket Data'}</h4>
          {dataSource === 'api' && apiError && <p className="text-danger">API Error: {apiError}</p>}
          {dataSource === 'ws' && socketError && <p className="text-danger">WebSocket Error: {socketError}</p>}
          
          {selectedData ? (
            <ul className="list-group">
              <li className="list-group-item">Raw Weight: {selectedData.rawWeight}</li>
              <li className="list-group-item">Processed Weight: {selectedData.processedWeight} Kg</li>
              <li className="list-group-item">Timestamp: {selectedData.timestamp}</li>
            </ul>
          ) : (
            <p>{dataSource === 'api' ? 'Fetching API data...' : 'Waiting for WebSocket data...'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightDisplay;
