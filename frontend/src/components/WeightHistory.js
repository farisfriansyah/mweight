// mweight/frontend/src/components/WeightHistory.js
import React, { useEffect, useState, useCallback } from 'react';
import { fetchWeightHistoryData } from '../api/api';
import connectWebSocket from '../api/socket';
import DataTable from 'react-data-table-component';

// Define columns for react-data-table-component
const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true,
  },
  {
    name: 'Raw Weight',
    selector: row => row.rawWeight,
    sortable: true,
  },
  {
    name: 'Processed Weight',
    selector: row => row.processedWeight,
    sortable: true,
  },
  {
    name: 'Timestamp',
    selector: row => new Date(row.timestamp).toLocaleString(),
    sortable: true,
  },
];

const WeightHistory = () => {
  const [apiData, setApiData] = useState([]);
  const [wsData, setWsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optimized API Data Fetch with debounce using useCallback
  const loadWeightHistory = useCallback(async () => {
    try {
      const data = await fetchWeightHistoryData();
      setApiData(data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching API data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeightHistory();
    const interval = setInterval(loadWeightHistory, 5000); // Fetch API data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [loadWeightHistory]);

  // WebSocket connection with optimized state management
  useEffect(() => {
    const onMessage = (data) => {
      if (data.event === 'weight-history' && data.data) {
        // Filter out duplicates based on 'id'
        setWsData((prevData) => {
          const newData = data.data;
          const updatedData = newData.filter(
            (item) => !prevData.some((prevItem) => prevItem.id === item.id)
          );
          return [...prevData, ...updatedData];
        });
      }
    };

    const ws = connectWebSocket(onMessage);
    return () => ws && ws.close(); // Cleanup WebSocket connection on component unmount
  }, []);

  return (
    <div className="container mt-4">
      <h2>Weight History Display</h2>
      <div className="row">
        {/* API Data Table */}
        <div className="col-md-6">
          <h3>Data from API</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable
              id="apiDataTable"  // Unique ID for API data table
              columns={columns}
              data={apiData}
              pagination
              highlightOnHover
              responsive
            />
          )}
        </div>

        {/* WebSocket Data Table */}
        <div className="col-md-6">
          <h3>Data from WebSocket</h3>
          {wsData.length === 0 ? (
            <p>No records to display from WebSocket.</p> // Handle no data case
          ) : (
            <DataTable
              id="wsDataTable"  // Unique ID for WebSocket data table
              columns={columns}
              data={wsData}
              pagination
              highlightOnHover
              responsive
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightHistory;
