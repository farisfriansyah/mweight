// mweight/frontend/src/components/WeightHistory.js
import React, { useEffect, useState } from 'react';
import { fetchWeightHistoryData } from '../api/api';
import connectWebSocket from '../api/socket';

const WeightHistory = () => {
  const [apiData, setApiData] = useState([]);
  const [wsData, setWsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeightHistory = async () => {
      const data = await fetchWeightHistoryData();
      setApiData(data?.data || []);
      setLoading(false);
    };

    loadWeightHistory();
    const interval = setInterval(loadWeightHistory, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onMessage = (data) => {
      if (data.event === 'weight-history' && data.data) {
        setWsData(data.data);
      }
    };

    const ws = connectWebSocket(onMessage);
    return () => ws && ws.close();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Weight History Display</h2>
      <div className="row">
        <div className="col-md-6">
          <h3>Data from API</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Raw Weight</th>
                  <th>Processed Weight</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {apiData.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{entry.rawWeight}</td>
                    <td>{entry.processedWeight}</td>
                    <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="col-md-6">
          <h3>Data from WebSocket</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Raw Weight</th>
                <th>Processed Weight</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {wsData.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.rawWeight}</td>
                  <td>{entry.processedWeight}</td>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeightHistory;
