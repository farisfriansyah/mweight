import React from 'react';
import WeightDisplay from './components/WeightDisplay';
import TimeCapture from './components/TimeCapture';

const App = () => {
  return (
    <div>
      <h1>Monitoring Berat Kendaraan</h1>
      <WeightDisplay />
      <TimeCapture /> {/* Menambahkan komponen TimeCapture */}
    </div>
  );
};

export default App;
