// mweight/frontend/src/components/WeightHistory.js
import React, { useContext, useEffect, useState } from "react";
import { WeightHistoryContext } from "../context/WeightHistoryContext";
import { Card, Tab, Nav } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Chart from "react-apexcharts";

const columns = [
  // { name: "ID", selector: (row) => row.id, sortable: true },
  // { name: "Raw Weight", selector: (row) => row.rawWeight, sortable: true },
  {
    name: "Timestamp",
    selector: (row) => {
      const localDate = new Date(row.timestamp).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric', // Tahun dengan 2 digit
      });
      const localTime = new Date(row.timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
  
      return `${localDate}, ${localTime}`;
    },
    sortable: true,
  },
  {
    name: "Processed Weight",
    selector: (row) => `${row.processedWeight} Kg`,
    sortable: true,
  },
  
];

const WeightHistory = ({ dataSource }) => {
  const { apiData, wsData, loading } = useContext(WeightHistoryContext);
  const [displayData, setDisplayData] = useState([]);

  // Update display data based on selected source
  useEffect(() => {
    if (dataSource === "api") {
      setDisplayData(apiData);
    } else {
      setDisplayData(wsData);
    }
  }, [dataSource, apiData, wsData]);

  const chartOptions = {
    chart: {
      id: "weight-history-chart",
      type: "line",
      zoom: { enabled: true },
    },
    xaxis: {
      type: "datetime",
      title: { text: "Timestamp" },
      labels: {
        formatter: (value) => {
          const localDate = new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: undefined,
          }) + ', ' + new Date(value).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }); // Localize timezone
          return localDate;
        },
      },
    },
    yaxis: {
      title: { text: "Weight (Kg)" },
      labels: {
        formatter: (value) => `${value} Kg`, // Add "Kg" to y-axis labels
      },
    },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    tooltip: {
      x: {
        formatter: (value) => {
          const localDate = new Date(value).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }) + ', ' + new Date(value).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }); // Localize timezone
          return localDate;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "API",
      data: apiData.map((d) => ({ x: d.timestamp, y: d.processedWeight })),
      color: "#FF5733", // Red color for API data
    },
    {
      name: "WebSocket",
      data: wsData.map((d) => ({ x: d.timestamp, y: d.processedWeight })),
      color: "#33B5FF", // Blue color for WebSocket data
    },
  ];

  return (
    <div className="container mt-4">
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Weight Display</h5>
          <Tab.Container defaultActiveKey="chart">
            <Nav variant="tabs" className="nav-pills mb-3" style={{ borderBottom: 'none' }}>
              <Nav.Item className="me-2">
                <Nav.Link eventKey="chart">Chart</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="table">Table</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="chart">
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="line"
                  height="350"
                />
              </Tab.Pane>
              <Tab.Pane eventKey="table">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <DataTable
                      columns={columns}
                      data={displayData}
                      pagination
                      paginationPerPage={5} // Use state for rows per page
                      paginationRowsPerPageOptions={[5, 10, 15]} // Allow user to select rows per page
                      highlightOnHover
                      responsive
                    />
                  </div>
                )}
              </Tab.Pane>
              
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WeightHistory;
