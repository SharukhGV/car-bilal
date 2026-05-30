import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [speed, setSpeed] = useState(58); 
  const [reverse, setReverse] = useState(false);
  // Status states: 'disconnected', 'connecting', 'connected'
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Change this to match your ESP32's current IP address configuration
  const ESP32_URL = "http://192.168.4.1";

  // Check connection status manually or on mount
  const checkConnection = () => {
    setConnectionStatus('connecting');
    
    // We fetch a lightweight /ping endpoint on the ESP32
    fetch(`${ESP32_URL}/ping`, { 
      method: 'GET',
      mode: 'cors'
    })
    .then(res => {
      if (res.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    })
    .catch(() => {
      setConnectionStatus('disconnected');
      console.error("Could not reach ESP32. Check your Wi-Fi network connection.");
    });
  };

  // Automatically check the connection once when the application loads
  useEffect(() => {
    checkConnection();
  }, []);

  const sendCommand = (action) => {
    const finalAction = reverse
      ? (action === 'forward' ? 'backward' :
         action === 'backward' ? 'forward' : action)
      : action;

    fetch(`${ESP32_URL}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: finalAction })
    })
    .then(res => res.json())
    .then(data => {
      if (data && typeof data.speed !== 'undefined') {
        setSpeed(Math.round(data.speed * 100));
        // If a command succeeds, we know we are still connected
        setConnectionStatus('connected');
      }
    })
    .catch(() => {
      setConnectionStatus('disconnected');
      console.error("Communication error reaching ESP32");
    });
  };

  const handleTouchStart = (e, action) => {
    e.preventDefault(); 
    sendCommand(action);
  };

  const handleTouchEnd = (e, action) => {
    e.preventDefault();
    sendCommand(action);
  };

  return (
    <div className="controller">
      {/* STATUS NOTIFICATION BAR */}
      <div className={`status-bar ${connectionStatus}`}>
        {connectionStatus === 'connected' && "🟢 Connected to Bilal Car"}
        {connectionStatus === 'connecting' && "🟡 Testing connection..."}
        {connectionStatus === 'disconnected' && "🔴 Offline - Not Connected"}
      </div>

      <h1>Bilal Car</h1>

      <div className="utility-controls">
        {/* CONNECT BUTTON */}
        <button className="connect-btn" onClick={checkConnection}>
          {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect to Car'}
        </button>

        <button 
          style={{ width: '100px' }}
          className={`reverse-toggle ${reverse ? 'active' : ''}`}
          onClick={() => setReverse(!reverse)}
        >
          Reverse: {reverse ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="d-pad">
        <button 
          onTouchStart={(e) => handleTouchStart(e, 'forward')} 
          onTouchEnd={(e) => handleTouchEnd(e, 'stop')}
          onMouseDown={() => sendCommand('forward')}
          onMouseUp={() => sendCommand('stop')}
        >
          ↑
        </button>

        <div className="middle-row">
          <button 
            onTouchStart={(e) => handleTouchStart(e, 'left')} 
            onTouchEnd={(e) => handleTouchEnd(e, 'stop')}
            onMouseDown={() => sendCommand('left')}
            onMouseUp={() => sendCommand('stop')}
          >
            ←
          </button>

          <button onClick={() => sendCommand('stop')} className="stop-btn">
            STOP
          </button>

          <button 
            onTouchStart={(e) => handleTouchStart(e, 'right')} 
            onTouchEnd={(e) => handleTouchEnd(e, 'stop')}
            onMouseDown={() => sendCommand('right')}
            onMouseUp={() => sendCommand('stop')}
          >
            →
          </button>
        </div>

        <button 
          onTouchStart={(e) => handleTouchStart(e, 'backward')} 
          onTouchEnd={(e) => handleTouchEnd(e, 'stop')}
          onMouseDown={() => sendCommand('backward')}
          onMouseUp={() => sendCommand('stop')}
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