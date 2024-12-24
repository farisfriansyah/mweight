// src/App.js
import React, { useState } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Tetap mengimpor CSS Bootstrap

import WeightDisplay from './components/WeightDisplay';
import WeightHistory from './components/WeightHistory';
import { WeightHistoryProvider } from './context/WeightHistoryContext';

function App() {
  const [selectedSource, setSelectedSource] = useState('ws'); // Set default to 'ws' (WebSocket)

  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
  };

  return (
    <div className="App">
      <div className="container mt-4">
        <Row className="justify-content-between align-items-center">
          <Col md={6}>
            <h3 className="mb-0">Select Data Source</h3>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center float-end position-relative">
              <label htmlFor="data-source" className="form-label me-3 mb-0">
                Choose Data Source:
              </label>
              <select
                id="data-source"
                className="form-select"
                style={{width: 'fit-content'}}
                value={selectedSource}
                onChange={handleSourceChange}
              >
                <option value="ws">WebSocket</option>
                <option value="api">API</option>
              </select>
            </div>
          </Col>
        </Row>
      </div>

      <div className="container mt-4">
        <Row className="justify-content-between align-items-center">
          <Col md={6}>
            {/* Pass selectedSource to both components */}
            <WeightDisplay dataSource={selectedSource} />
          </Col>
          <Col md={6}>
            <WeightHistoryProvider>
              <WeightHistory dataSource={selectedSource} />
            </WeightHistoryProvider>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
