import React, { useState } from 'react';
import './App.css';

function App() {
  const [speed, setSpeed] = useState(50);
  // Replace with your Pi's IP (usually 192.168.4.1 if in Hotspot mode)
  const PI_URL = "http://192.168.4.1:5000/move";

  const sendCommand = (action) => {
    fetch(PI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    })
    .then(res => res.json())
    .then(data => data.speed && setSpeed(data.speed * 100))
    .catch(err => console.error("Communication error"));
  };

  return (
    <div className="controller">
      <h1>Bilal Car</h1>
      
      <div className="d-pad">
        <button onTouchStart={() => sendCommand('forward')} onTouchEnd={() => sendCommand('stop')}>UP</button>
        <div className="middle-row">
          <button onTouchStart={() => sendCommand('left')} onTouchEnd={() => sendCommand('stop')}>LEFT</button>
          <button onClick={() => sendCommand('stop')} className="stop-btn">STOP</button>
          <button onTouchStart={() => sendCommand('right')} onTouchEnd={() => sendCommand('stop')}>RIGHT</button>
        </div>
        <button onTouchStart={() => sendCommand('backward')} onTouchEnd={() => sendCommand('stop')}>DOWN</button>
      </div>

      <div className="speed-controls">
        <p>Speed: {speed}%</p>
        <button onClick={() => sendCommand('slower')}>-</button>
        <button onClick={() => sendCommand('faster')}>+</button>
      </div>
    </div>
  );
}

export default App;