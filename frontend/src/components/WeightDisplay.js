// mweight/frontend/src/components/WeightDisplay.js
import React from 'react';
// import { Card, Row, Tab, Nav, Col, CardHeader } from "react-bootstrap";
import useWebSocket from '../hooks/useWebSocket';
import useApi from '../hooks/useApi';

const WeightDisplay = ({ dataSource }) => {
  const WS_URL = process.env.REACT_APP_WS_URL || 'ws://10.88.67.70:3002';
  const API_URL = process.env.REACT_APP_API_WEIGHT_URL || 'http://10.88.67.70:3001/api/weight';

  const { data: socketData, error: socketError } = useWebSocket(WS_URL);
  const { data: apiData, error: apiError } = useApi(API_URL);

  // Select data based on the data source
  const selectedData = dataSource === 'api' ? apiData : socketData;

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const localDate = new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric', // 4-digit year
    });
    const localTime = new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return `${localDate}, ${localTime}`;
  };

  return (
    <div className="weight-display container mt-4">
      <h2 className="text-center">RH Weight</h2>

      <div className="row text-center">
        {/* Display data based on selected source */}
        <div className="col-md-12">
          <h4>{dataSource === 'api' ? 'API Data' : 'WebSocket Data'}</h4>
          {dataSource === 'api' && apiError && <p className="text-danger">API Error: {apiError}</p>}
          {dataSource === 'ws' && socketError && <p className="text-danger">WebSocket Error: {socketError}</p>}
          
          {selectedData ? (
              <div className='container my-5'>
                <h1><strong>{selectedData.processedWeight}</strong> <sup><small>Kg</small></sup></h1>
                <h6>{formatTimestamp(selectedData.timestamp)}</h6>
              </div>
            // <ul className="list-group">
            //   <li className="list-group-item">Raw Weight: {selectedData.rawWeight}</li>
            //   <li className="list-group-item">Processed Weight: {selectedData.processedWeight} Kg</li>
            //   <li className="list-group-item">
            //     Timestamp: {formatTimestamp(selectedData.timestamp)}
            //   </li>
            // </ul>
          ) : (
            <p>{dataSource === 'api' ? 'Fetching API data...' : 'Waiting for WebSocket data...'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightDisplay;

