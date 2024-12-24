// src/App.js
// src/App.js
import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import WeightDisplay from './components/WeightDisplay';
import WeightHistory from './components/WeightHistory';
import SocketSettings from './components/SocketSettings';

function App() {
  return (
    <div className="App">
      <header className="bg-dark text-white p-3 text-center">
        <h1>Real-Time Weight Monitoring</h1>
      </header>
      <WeightDisplay />
      <WeightHistory />
      <SocketSettings />
    </div>
  );
}

export default App;
