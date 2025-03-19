// src/App.js
import React, { useState } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Tetap mengimpor CSS Bootstrap

import WeightDisplay from "./components/WeightDisplay";
import WeightHistory from "./components/WeightHistory";
import { WeightHistoryProvider } from "./context/WeightHistoryContext";

function App() {
  const [selectedSource, setSelectedSource] = useState("ws"); // Set default to 'ws' (WebSocket)

  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
  };

  return (
    <div className="App">
      <div className="container">
        <Row className="justify-content-between align-items-center">
          <Col sm={12} md={12} lg={6}>
            {/* Pass selectedSource to both components */}
            <WeightDisplay dataSource={selectedSource} />
            <div className="d-flex position-relative align-items-center justify-content-center text-center mt-4">
              <label htmlFor="data-source" className="form-label me-3 mb-0">
                Choose Data Source:
              </label>
              <select
                id="data-source"
                className="form-select"
                style={{ width: "fit-content" }}
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
      </div>
    </div>
  );
}

export default App;
