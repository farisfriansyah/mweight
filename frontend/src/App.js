// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import WeightDisplay from './components/WeightDisplay';
import WeightHistory from './components/WeightHistory';
import AutoSaveStatus from './components/AutoSaveStatus';
import DailyWeightReport from './components/DailyWeightReport';
import { WeightHistoryProvider } from './context/WeightHistoryContext';

function App() {
  const [selectedSource, setSelectedSource] = useState('ws');

  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
  };

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={NavLink} to="/">Weight Monitoring</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/report">Daily Report</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Row className="justify-content-between align-items-center">
                    <Col sm={12} md={12} lg={6}>
                      <WeightDisplay dataSource={selectedSource} />
                      <div className="d-flex position-relative align-items-center justify-content-center text-center mt-4">
                        <label htmlFor="data-source" className="form-label me-3 mb-0">
                          Choose Data Source:
                        </label>
                        <select
                          id="data-source"
                          className="form-select"
                          style={{ width: 'fit-content' }}
                          value={selectedSource}
                          onChange={handleSourceChange}
                        >
                          <option value="ws">WebSocket</option>
                          <option value="api">API</option>
                        </select>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={6}>
                      <WeightHistoryProvider>
                        <WeightHistory dataSource={selectedSource} />
                      </WeightHistoryProvider>
                    </Col>
                  </Row>
                </>
              }
            />
            <Route path="/report" element={<DailyWeightReport />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;