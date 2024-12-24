// mweight/frontend/src/components/WeightHistory.js
import React, { useContext, useEffect, useState } from 'react';
import { WeightHistoryContext } from '../context/WeightHistoryContext';
import DataTable from 'react-data-table-component';
import Chart from 'react-apexcharts';

const columns = [
  { name: 'ID', selector: (row) => row.id, sortable: true },
  { name: 'Raw Weight', selector: (row) => row.rawWeight, sortable: true },
  { name: 'Processed Weight', selector: (row) => `${row.processedWeight} Kg`, sortable: true },
  { name: 'Timestamp', selector: (row) => new Date(row.timestamp).toLocaleString(), sortable: true },
];

const WeightHistory = ({ dataSource }) => {
  const { apiData, wsData, loading } = useContext(WeightHistoryContext);
  const [displayData, setDisplayData] = useState([]);

  // Update display data based on selected source
  useEffect(() => {
    if (dataSource === 'api') {
      setDisplayData(apiData);
    } else {
      setDisplayData(wsData);
    }
  }, [dataSource, apiData, wsData]);

  const chartOptions = {
    chart: { id: 'weight-history-chart', type: 'line', zoom: { enabled: true } },
    xaxis: {
      type: 'datetime',
      title: { text: 'Timestamp' },
      labels: {
        formatter: (value) => {
          const localDate = new Date(value).toLocaleString(); // Localize timezone
          return localDate;
        },
      },
    },
    yaxis: {
      title: { text: 'Weight (Kg)' },
      labels: {
        formatter: (value) => `${value} Kg`, // Add "Kg" to y-axis labels
      },
    },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    tooltip: {
      x: {
        formatter: (value) => {
          const localDate = new Date(value).toLocaleString(); // Localize timezone
          return localDate;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: 'API Processed Weight',
      data: apiData.map((d) => ({ x: d.timestamp, y: d.processedWeight })),
      color: '#FF5733', // Red color for API data
    },
    {
      name: 'WebSocket Processed Weight',
      data: wsData.map((d) => ({ x: d.timestamp, y: d.processedWeight })),
      color: '#33B5FF', // Blue color for WebSocket data
    },
  ];

  return (
    <div className="container mt-4">
      <h2>Weight History Display</h2>
      <div className="row">
        <div className="col-md-12">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable columns={columns} data={displayData} pagination highlightOnHover responsive />
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h3>Processed Weight Over Time</h3>
          <Chart options={chartOptions} series={chartSeries} type="line" height="350" />
        </div>
      </div>
    </div>
  );
};

export default WeightHistory;
