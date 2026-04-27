import React, { useState } from 'react';
import './App.css';

function App() {
  const [speed, setSpeed] = useState(50);
  const [reverse, setReverse] = useState(false);

  const PI_URL = "http://192.168.4.1:5000/move";

  const sendCommand = (action) => {
    const finalAction = reverse
      ? (action === 'forward' ? 'backward' :
         action === 'backward' ? 'forward' : action)
      : action;

    fetch(PI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: finalAction })
    })
    .then(res => res.json())
    .then(data => data.speed && setSpeed(data.speed * 100))
    .catch(() => console.error("Communication error"));
  };

  return (
    <div className="controller">
      <h1>Bilal Car</h1>

      <button style={{width: '100px', marginBottom: '20px'}}
        className={`reverse-toggle ${reverse ? 'active' : ''}`}
        onClick={() => setReverse(!reverse)}
      >
        Reverse: {reverse ? 'ON' : 'OFF'}
      </button>

      <div className="d-pad">
        <button 
          onTouchStart={() => sendCommand('forward')} 
          onTouchEnd={() => sendCommand('stop')}
        >
          ↑
        </button>

        <div className="middle-row">
          <button 
            onTouchStart={() => sendCommand('left')} 
            onTouchEnd={() => sendCommand('stop')}
          >
            ←
          </button>

          <button 
            onClick={() => sendCommand('stop')} 
            className="stop-btn"
          >
            STOP
          </button>

          <button 
            onTouchStart={() => sendCommand('right')} 
            onTouchEnd={() => sendCommand('stop')}
          >
            →
          </button>
        </div>

        <button 
          onTouchStart={() => sendCommand('backward')} 
          onTouchEnd={() => sendCommand('stop')}
        >
          ↓
        </button>
      </div>

      <div className="speed-controls">
        <p>Speed: {speed}%</p>
        <div className="speed-buttons">
          <button onClick={() => sendCommand('slower')}>-</button>
          <button onClick={() => sendCommand('faster')}>+</button>
        </div>
      </div>
    </div>
  );
}

export default App;