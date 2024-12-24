// src/App.js
import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Tetap mengimpor CSS Bootstrap

import WeightDisplay from './components/WeightDisplay';
import WeightHistory from './components/WeightHistory';
import SocketSettings from './components/SocketSettings';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="p-3">
        <Container>
          <Navbar.Brand>Real-Time Weight Monitoring</Navbar.Brand>
        </Container>
      </Navbar>
      <WeightDisplay />
      <WeightHistory />
      <SocketSettings />
    </div>
  );
}

export default App;
