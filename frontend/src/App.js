import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [sensorData, setSensorData] = useState([]);
  const [controlState, setControlState] = useState({
    heatingLedState: false,
    coolingLedState: false,
    setpoint: 20.0
  });
  const [setpointInput, setSetpointInput] = useState(20.0);

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      await fetchControlState();
      await fetchSensorData();
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchSensorData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sensor?limit=12`);
      
      const dataCount = response.data.length;
      
      // Create array for last 60 seconds (12 data points at 5s intervals)
      const fullTimeRange = [];
      for (let i = 0; i < 12; i++) {
        const timeInSeconds = (11 - i) * 5; // Reverse: 55s, 50s, 45s... 5s, 0s
        fullTimeRange.push({
          timeLabel: `${timeInSeconds}s`,
          timeValue: timeInSeconds,
          thermostatTemp: null,
          setpoint: null
        });
      }
      
      // Fill in actual data points from the end (sensor data now includes setpoint)
      response.data.forEach((item, index) => {
        const position = 12 - dataCount + index; // Position in the array
        if (position >= 0 && position < 12) {
          fullTimeRange[position] = {
            ...item,
            timeLabel: fullTimeRange[position].timeLabel,
            timeValue: fullTimeRange[position].timeValue
          };
        }
      });
      
      setSensorData(fullTimeRange);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const fetchControlState = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/control`);
      if (response.data) {
        setControlState(response.data);
        setSetpointInput(response.data.setpoint);
      }
    } catch (error) {
      console.error('Error fetching control state:', error);
    }
  };

  const handleSetpointChange = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/control/setpoint`, {
        setpoint: parseFloat(setpointInput)
      });
      if (response.data) {
        setControlState(response.data);
      }
    } catch (error) {
      console.error('Error updating setpoint:', error);
    }
  };

  return (
    <div className="App">
      <h1>Monitoring Dashboard</h1>
      
      <div className="dashboard-container">
        <div className="chart-section">
          <h2>Sensor Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timeLabel" 
                tick={{ fontSize: 12 }}
                height={60}
                label={{ value: 'Time', position: 'insideBottom', offset: -10 }}
                type="category"
                allowDataOverflow={false}
                domain={[0, 55]}
              />
              <YAxis 
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                domain={[-10, 40]}
                ticks={[-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40]}
              />
              <Tooltip 
                labelFormatter={() => ''}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                      }}>
                        {payload.map((entry, index) => (
                          <div key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value !== null ? entry.value : 'No data'}
                          </div>
                        ))}
                        {data.humidity && (
                          <div style={{ color: '#ff7300', marginTop: '5px' }}>
                            Humidity: {data.humidity}%
                          </div>
                        )}
                        {data.pressure && (
                          <div style={{ color: '#d946ef' }}>
                            Pressure: {data.pressure} hPa
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }} 
                align="center"
                content={(props) => {
                  const { payload } = props;
                  return (
                    <div style={{ textAlign: 'center' }}>
                      {payload.map((entry, index) => (
                        <span key={`item-${index}`} style={{ marginRight: '20px', color: entry.color }}>
                          <span style={{ 
                            display: 'inline-block', 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: entry.color,
                            marginRight: '5px',
                            verticalAlign: 'middle'
                          }}></span>
                          {entry.value}
                        </span>
                      ))}
                      <span style={{ marginRight: '20px', color: '#ff7300' }}>
                        <span style={{ 
                          display: 'inline-block', 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: '#ff7300',
                          marginRight: '5px',
                          verticalAlign: 'middle'
                        }}></span>
                        Humidity (%)
                      </span>
                      <span style={{ color: '#d946ef' }}>
                        <span style={{ 
                          display: 'inline-block', 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: '#d946ef',
                          marginRight: '5px',
                          verticalAlign: 'middle'
                        }}></span>
                        Pressure (hPa)
                      </span>
                    </div>
                  );
                }}
              />
              <Line 
                type="monotone" 
                dataKey="thermostatTemp" 
                stroke="#8884d8" 
                name="Temperature (°C)"
                connectNulls={false}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="setpoint" 
                stroke="#82ca9d" 
                name="Setpoint (°C)"
                strokeDasharray="5 5"
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="control-section">
          <div className="setpoint-control">
            <h2>Temperature Setpoint</h2>
            <div className="setpoint-input-group">
              <input 
                type="number" 
                value={setpointInput}
                onChange={(e) => setSetpointInput(e.target.value)}
                step="0.5"
                min="0"
                max="50"
              />
              <button onClick={handleSetpointChange}>Update Setpoint</button>
            </div>
            <p>Current Setpoint: {controlState.setpoint}°C</p>
          </div>

          <div className="led-indicators">
            <h2>HVAC Status</h2>
            <div className="led-container">
              <div className="led-item">
                <div 
                  className="led-circle"
                  style={{ 
                    backgroundColor: controlState.heatingLedState ? '#ff4444' : '#cccccc',
                    border: '3px solid black',
                    boxShadow: controlState.heatingLedState ? '0 0 20px rgba(255, 68, 68, 0.8)' : 'none'
                  }}
                />
                <p>Heating LED</p>
                <p className="led-status">{controlState.heatingLedState ? 'ON' : 'OFF'}</p>
              </div>

              <div className="led-item">
                <div 
                  className="led-circle"
                  style={{ 
                    backgroundColor: controlState.coolingLedState ? '#4444ff' : '#cccccc',
                    border: '3px solid black',
                    boxShadow: controlState.coolingLedState ? '0 0 20px rgba(68, 68, 255, 0.8)' : 'none'
                  }}
                />
                <p>Cooling LED</p>
                <p className="led-status">{controlState.coolingLedState ? 'ON' : 'OFF'}</p>
              </div>
            </div>
          </div>

          <div className="led-indicators">
            <h2>Window Status</h2>
            <div className="led-container">
              <div className="led-item">
                <div 
                  className="led-circle"
                  style={{ 
                    backgroundColor: '#cccccc',
                    border: '3px solid black'
                  }}
                />
                <p>Window</p>
                <p className="led-status">CLOSED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
