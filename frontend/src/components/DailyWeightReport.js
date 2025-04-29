// mweight/frontend/src/components/DailyWeightReport.js

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, InputGroup, FormControl } from 'react-bootstrap';
import moment from 'moment-timezone';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import DataTable from 'react-data-table-component';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_DAILY_WEIGHT_HISTORY_URL = process.env.REACT_APP_API_WEIGHT_HISTORY_URL || 'http://localhost:3001/api/weight-history/daily';

const columns = [
  {
    name: 'ID',
    selector: (row) => row.id,
    sortable: true,
    filterable: true,
  },
  {
    name: 'Raw Weight',
    selector: (row) => row.rawWeight,
    sortable: true,
    filterable: true,
  },
  {
    name: 'Processed Weight',
    selector: (row) => `${row.processedWeight} Kg`,
    sortable: true,
    filterable: true,
  },
  {
    name: 'Timestamp',
    selector: (row) => moment.tz(row.timestamp, 'Asia/Jakarta').format('DD MMM YYYY, HH:mm'),
    sortable: true,
    filterable: true,
  },
];

const DailyWeightReport = () => {
  const [date, setDate] = useState(moment().tz('Asia/Jakarta').format('YYYY-MM-DD'));
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    id: '',
    rawWeight: '',
    processedWeight: '',
    timestamp: '',
  });

  // Fetch data harian dengan useCallback
  const fetchDailyData = useCallback(async () => {
    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      setError('Please select a valid date (YYYY-MM-DD).');
      setData([]);
      setFilteredData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setData([]);
    setFilteredData([]);
    try {
      console.log(`Fetching daily data for date: ${date}`);
      const response = await fetch(`${API_DAILY_WEIGHT_HISTORY_URL}?date=${date}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch daily data: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Daily data received:', result);

      // Validasi data untuk memastikan timestamp dalam format yang benar
      const filteredData = (result.data || []).filter((item) => {
        const itemDate = moment.tz(item.timestamp, 'Asia/Jakarta').format('YYYY-MM-DD');
        const isValid = itemDate === date;
        if (!isValid) {
          console.warn(`Filtered out record with date: ${itemDate} (expected: ${date})`, item);
        }
        return isValid;
      });

      console.log(`Filtered ${filteredData.length} records for date: ${date} from ${result.data.length} total records`);
      setData(filteredData);
      setFilteredData(filteredData);
    } catch (error) {
      console.error('Error fetching daily data:', error);
      setError(`Error fetching data: ${error.message}`);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  // Panggil fetchDailyData saat date berubah
  useEffect(() => {
    fetchDailyData();
  }, [fetchDailyData]);

  // Handler untuk perubahan tanggal
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    console.log(`Date changed to: ${newDate}`);
    setDate(newDate);
    setSearch('');
    setFilters({ id: '', rawWeight: '', processedWeight: '', timestamp: '' });
  };

  // Handler untuk pencarian global
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    console.log(`Search query: ${value}`);
    filterData(value, filters);
  };

  // Handler untuk filter per kolom
  const handleFilterChange = (e, column) => {
    const value = e.target.value;
    const newFilters = { ...filters, [column]: value };
    setFilters(newFilters);
    console.log(`Filter updated for ${column}: ${value}`);
    filterData(search, newFilters);
  };

  // Fungsi untuk memfilter data berdasarkan pencarian dan filter
  const filterData = (searchQuery, filterValues) => {
    let result = [...data];

    // Pencarian global
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      result = result.filter((item) => (
        String(item.id).toLowerCase().includes(lowerSearch) ||
        String(item.rawWeight).toLowerCase().includes(lowerSearch) ||
        `${item.processedWeight} Kg`.toLowerCase().includes(lowerSearch) ||
        moment.tz(item.timestamp, 'Asia/Jakarta').format('DD MMM YYYY, HH:mm').toLowerCase().includes(lowerSearch)
      ));
    }

    // Filter per kolom
    if (filterValues.id) {
      result = result.filter((item) => String(item.id).toLowerCase().includes(filterValues.id.toLowerCase()));
    }
    if (filterValues.rawWeight) {
      result = result.filter((item) => String(item.rawWeight).toLowerCase().includes(filterValues.rawWeight.toLowerCase()));
    }
    if (filterValues.processedWeight) {
      result = result.filter((item) => `${item.processedWeight} Kg`.toLowerCase().includes(filterValues.processedWeight.toLowerCase()));
    }
    if (filterValues.timestamp) {
      result = result.filter((item) => (
        moment.tz(item.timestamp, 'Asia/Jakarta').format('DD MMM YYYY, HH:mm').toLowerCase().includes(filterValues.timestamp.toLowerCase())
      ));
    }

    console.log(`Filtered ${result.length} records after search and filters`);
    setFilteredData(result);
  };

  // Setup grafik amCharts
  useEffect(() => {
    if (filteredData.length === 0) return;

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
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueX.formatDate("dd MMM, HH:mm")}',
        }),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        title: 'Processed Weight (Kg)',
        min: 0, // Paksa sumbu Y mulai dari 0
        strictMinMax: true, // Pastikan min tetap 0
        extraMax: 0.1, // Ruang tambahan di atas maksimum
        calculateTotals: true,
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Processed Weight',
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

    const seriesData = filteredData.map((item) => ({
      timestamp: new Date(item.timestamp).getTime(),
      processedWeight: item.processedWeight,
    }));
    series.data.setAll(seriesData);
    console.log('Chart series data:', seriesData);

    chart.set('cursor', am5xy.XYCursor.new(root, {}));

    return () => root.dispose();
  }, [filteredData]);

  // Download CSV
  const downloadCSV = () => {
    const csvData = filteredData.map((item) => ({
      ID: item.id,
      'Raw Weight': item.rawWeight,
      'Processed Weight': `${item.processedWeight} Kg`,
      Timestamp: moment.tz(item.timestamp, 'Asia/Jakarta').format('DD MMM YYYY, HH:mm'),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `weight_report_${date}.csv`);
    link.click();
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Daily Weight Report - ${moment(date).format('YYYY-MM-DD')}`, 14, 20);
    doc.autoTable({
      head: [['ID', 'Raw Weight', 'Processed Weight', 'Timestamp']],
      body: filteredData.map((item) => [
        item.id,
        item.rawWeight,
        `${item.processedWeight} Kg`,
        moment.tz(item.timestamp, 'Asia/Jakarta').format('DD MMM YYYY, HH:mm'),
      ]),
      startY: 30,
    });
    doc.save(`weight_report_${date}.pdf`);
  };

  // Download JSON
  const downloadJSON = () => {
    const jsonData = filteredData.map((item) => ({
      id: item.id,
      rawWeight: item.rawWeight,
      processedWeight: item.processedWeight,
      timestamp: moment.tz(item.timestamp, 'Asia/Jakarta').format('DD MMM YYYY, HH:mm'),
    }));
    const json = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `weight_report_${date}.json`);
    link.click();
  };

  // Komponen header untuk filter per kolom
  const FilterComponent = ({ column, onFilter }) => (
    <FormControl
      type="text"
      placeholder={`Filter ${column.name}`}
      value={filters[column.selector.name] || ''}
      onChange={(e) => onFilter(e, column.selector.name)}
      style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}
    />
  );

  // Sesuaikan kolom untuk menyertakan filter
  const enhancedColumns = columns.map((col) => ({
    ...col,
    header: () => (
      <div>
        {col.name}
        {col.filterable && <FilterComponent column={col} onFilter={handleFilterChange} />}
      </div>
    ),
  }));

  return (
    <Container className="mt-4">
      <h2>Daily Weight Report</h2>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={handleDateChange}
              max={moment().tz('Asia/Jakarta').format('YYYY-MM-DD')}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
          <Button variant="primary" onClick={fetchDailyData} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <p>Showing data for {moment(date).format('YYYY-MM-DD')}</p>
        </Col>
      </Row>
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      <Row className="mb-4">
        <Col>
          <h4>Data Table</h4>
          <InputGroup className="mb-3">
            <InputGroup.Text>Search</InputGroup.Text>
            <FormControl
              placeholder="Search all columns..."
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable
              columns={enhancedColumns}
              data={filteredData}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              highlightOnHover
              responsive
              striped
              noDataComponent={`No data available for ${moment(date).format('YYYY-MM-DD')}.`}
            />
          )}
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h4>Weight Over Time</h4>
          <div id="chartdiv" style={{ width: '100%', height: '400px' }}></div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Download Report</h4>
          <Button variant="success" onClick={downloadCSV} className="me-2" disabled={filteredData.length === 0}>
            Download CSV
          </Button>
          <Button variant="danger" onClick={downloadPDF} className="me-2" disabled={filteredData.length === 0}>
            Download PDF
          </Button>
          <Button variant="info" onClick={downloadJSON} disabled={filteredData.length === 0}>
            Download JSON
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DailyWeightReport;