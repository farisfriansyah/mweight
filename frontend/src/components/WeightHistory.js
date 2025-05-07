// mweight/frontend/src/components/WeightHistory.js
import React, { useContext, useEffect, useState } from "react";
import { WeightHistoryContext } from "../context/WeightHistoryContext";
import { Card, Tab, Nav } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AutoSaveStatus from './AutoSaveStatus';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import moment from 'moment-timezone';

const columns = [
  {
    name: "Timestamp",
    selector: (row) => {
      const localDate = new Date(row.timestamp).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
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

  // Filter data untuk hanya hari ini
  const filterTodayData = (data) => {
    const currentDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    const filtered = data.filter((item) => {
      const itemDate = moment.tz(item.timestamp, 'Asia/Jakarta').format('YYYY-MM-DD');
      const isValid = itemDate === currentDate;
      if (!isValid) {
        console.warn(`Filtered out record with date: ${itemDate} (expected: ${currentDate})`, item);
      }
      return isValid;
    });
    console.log(`Filtered ${filtered.length} records for ${currentDate} from ${data.length} total records`);
    return filtered;
  };

  // Update display data based on selected source
  useEffect(() => {
    setDisplayData([]); // Reset displayData
    if (dataSource === "api") {
      const filteredApiData = filterTodayData(apiData);
      setDisplayData(filteredApiData);
      console.log(`Filtered ${filteredApiData.length} API records for today`, filteredApiData);
    } else {
      const filteredWsData = filterTodayData(wsData);
      setDisplayData(filteredWsData);
      console.log(`Filtered ${filteredWsData.length} WebSocket records for today`, filteredWsData);
    }
  }, [dataSource, apiData, wsData]);

  // Setup grafik amCharts
  useEffect(() => {
    if (displayData.length === 0) return;

    const root = am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: 'minute', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        title: 'Timestamp',
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        title: 'Weight (Kg)',
        min: 0, // Paksa sumbu Y mulai dari 0 (tidak menampilkan negatif)
        strictMinMax: true, // Pastikan min tetap 0
        extraMax: 0.1, // Ruang tambahan di atas maksimum
        calculateTotals: true, // Pastikan rentang dihitung dengan benar
      })
    );

    // Log rentang sumbu Y setelah pembaruan
    yAxis.events.on('boundschanged', () => {
      console.log('Y-axis range:', yAxis.get('min'), yAxis.get('max'));
    });

    // Seri untuk API
    const apiSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'API',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'processedWeight',
        valueXField: 'timestamp',
        stroke: am5.color('#FF5733'),
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY} Kg at {valueX.formatDate("dd MMM, HH:mm")}',
        }),
      })
    );

    const apiSeriesData = filterTodayData(apiData).map((item) => ({
      timestamp: new Date(item.timestamp).getTime(),
      processedWeight: item.processedWeight,
    }));
    apiSeries.data.setAll(apiSeriesData);
    console.log('API series data:', apiSeriesData);

    // Seri untuk WebSocket
    const wsSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'WebSocket',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'processedWeight',
        valueXField: 'timestamp',
        stroke: am5.color('#33B5FF'),
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY} Kg at {valueX.formatDate("dd MMM, HH:mm")}',
        }),
      })
    );

    const wsSeriesData = filterTodayData(wsData).map((item) => ({
      timestamp: new Date(item.timestamp).getTime(),
      processedWeight: item.processedWeight,
    }));
    wsSeries.data.setAll(wsSeriesData);
    console.log('WebSocket series data:', wsSeriesData);

    chart.set('cursor', am5xy.XYCursor.new(root, {}));

    // Tambah legenda
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
      })
    );
    legend.data.setAll(chart.series.values);

    return () => root.dispose();
  }, [apiData, wsData]);

  return (
    <div className="container mt-4">
      <Card className="chartGraph-card mb-4 border border-0 rounded-4">
        <Card.Body>
          <AutoSaveStatus />
          <h5 className="mb-3">Weight History (Today)</h5>
          <p>Showing data for {moment().tz('Asia/Jakarta').format('YYYY-MM-DD')}</p>
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
                <div id="chartdiv" style={{ width: '100%', height: '350px' }}></div>
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
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 15]}
                      highlightOnHover
                      responsive
                      noDataComponent="No data available for today."
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