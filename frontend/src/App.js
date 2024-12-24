// src/App.js
import React, { useState } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Tetap mengimpor CSS Bootstrap

import WeightDisplay from './components/WeightDisplay';
import WeightHistory from './components/WeightHistory';
import SocketSettings from './components/SocketSettings';
import { WeightHistoryProvider } from './context/WeightHistoryContext';

function App() {
  const [selectedSource, setSelectedSource] = useState('ws'); // Set default to 'ws' (WebSocket)

  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="p-3">
        <Container>
          <Navbar.Brand>Real-Time Weight Monitoring</Navbar.Brand>
        </Container>
      </Navbar>

      <div className="container mt-4">
        <Row className="row justify-content-between align-items-center">
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

      {/* Pass selectedSource to both components */}
      <WeightDisplay dataSource={selectedSource} />
      <WeightHistoryProvider>
        <WeightHistory dataSource={selectedSource} />
      </WeightHistoryProvider>

      <SocketSettings />
    </div>
  );
}

export default App;
