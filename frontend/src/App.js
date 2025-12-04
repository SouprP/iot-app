import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [sensorData, setSensorData] = useState([]);
  const [co2Data, setCo2Data] = useState(null);
  const [doorData, setDoorData] = useState(null);
  const [thermostatData, setThermostatData] = useState({
    heater: false,
    setPoint: 20
  });

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllData();
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch thermostat data
      const thermostatResponse = await axios.get(`${API_BASE_URL}/api/thermostat?amount=12`);
      const thermostatArray = thermostatResponse.data;
      
      // Fetch CO2 sensor data (latest reading)
      const co2Response = await axios.get(`${API_BASE_URL}/api/co2?amount=1`);
      if (co2Response.data && co2Response.data.length > 0) {
        setCo2Data(co2Response.data[0]);
      }
      
      // Fetch door sensor data (latest reading)
      const doorResponse = await axios.get(`${API_BASE_URL}/api/door?amount=1`);
      if (doorResponse.data && doorResponse.data.length > 0) {
        setDoorData(doorResponse.data[0]);
      }
      
      // Set latest thermostat state
      if (thermostatArray.length > 0) {
        setThermostatData({
          heater: thermostatArray[0].heater,
          setPoint: thermostatArray[0].setPoint
        });
      }
      
      // Create array for last 60 seconds (12 data points at 5s intervals)
      const fullTimeRange = [];
      for (let i = 0; i < 12; i++) {
        const timeInSeconds = (11 - i) * 5; // Reverse: 55s, 50s, 45s... 5s, 0s
        fullTimeRange.push({
          timeLabel: `${timeInSeconds}s`,
          timeValue: timeInSeconds,
          setpoint: null
        });
      }
      
      // Fill in actual data points from the end (reverse order since API returns DESC)
      const dataCount = thermostatArray.length;
      thermostatArray.reverse().forEach((item, index) => {
        const position = 12 - dataCount + index;
        if (position >= 0 && position < 12) {
          fullTimeRange[position] = {
            timeLabel: fullTimeRange[position].timeLabel,
            timeValue: fullTimeRange[position].timeValue,
            setpoint: item.setPoint
          };
        }
      });
      
      setSensorData(fullTimeRange);
    } catch (error) {
      console.error('Error fetching data:', error);
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
                domain={[0, 35]}
                ticks={[0, 5, 10, 15, 20, 25, 30, 35]}
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
                        {co2Data && (
                          <>
                            <div style={{ color: '#ff7300', marginTop: '5px' }}>
                              Temperature: {co2Data.temperatureC}°C
                            </div>
                            <div style={{ color: '#8b5cf6' }}>
                              Humidity: {co2Data.humidityRh}%
                            </div>
                            <div style={{ color: '#06b6d4' }}>
                              CO2: {co2Data.co2Ppm} ppm
                            </div>
                          </>
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
                      {co2Data && (
                        <>
                          <span style={{ marginRight: '20px', color: '#ff7300' }}>
                            <span style={{ 
                              display: 'inline-block', 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: '#ff7300',
                              marginRight: '5px',
                              verticalAlign: 'middle'
                            }}></span>
                            Temp: {co2Data.temperatureC}°C
                          </span>
                          <span style={{ marginRight: '20px', color: '#8b5cf6' }}>
                            <span style={{ 
                              display: 'inline-block', 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: '#8b5cf6',
                              marginRight: '5px',
                              verticalAlign: 'middle'
                            }}></span>
                            Humidity: {co2Data.humidityRh}%
                          </span>
                          <span style={{ color: '#06b6d4' }}>
                            <span style={{ 
                              display: 'inline-block', 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: '#06b6d4',
                              marginRight: '5px',
                              verticalAlign: 'middle'
                            }}></span>
                            CO2: {co2Data.co2Ppm} ppm
                          </span>
                        </>
                      )}
                    </div>
                  );
                }}
              />
              <Line 
                type="monotone" 
                dataKey="setpoint" 
                stroke="#82ca9d" 
                name="Setpoint (°C)"
                strokeDasharray="5 5"
                connectNulls={true}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="control-section">
          <div className="setpoint-control">
            <h2>Temperature Setpoint</h2>
            <p>Current Setpoint: {thermostatData.setPoint}°C</p>
          </div>

          <div className="led-indicators">
            <h2>Heater Status</h2>
            <div className="led-container">
              <div className="led-item">
                <div 
                  className="led-circle"
                  style={{ 
                    backgroundColor: thermostatData.heater ? '#ff4444' : '#cccccc',
                    border: '3px solid black',
                    boxShadow: thermostatData.heater ? '0 0 20px rgba(255, 68, 68, 0.8)' : 'none'
                  }}
                />
                <p>Heater</p>
                <p className="led-status">{thermostatData.heater ? 'ON' : 'OFF'}</p>
              </div>
            </div>
          </div>

          <div className="led-indicators">
            <h2>Door Status</h2>
            <div className="led-container">
              <div className="led-item">
                <div 
                  className="led-circle"
                  style={{ 
                    backgroundColor: doorData?.doorOpen ? '#4444ff' : '#22c55e',
                    border: '3px solid black',
                    boxShadow: doorData?.doorOpen ? '0 0 20px rgba(68, 68, 255, 0.8)' : '0 0 20px rgba(34, 197, 94, 0.8)'
                  }}
                />
                <p>Door</p>
                <p className="led-status">{doorData?.doorOpen ? 'OPEN' : 'CLOSED'}</p>
                {doorData?.battery && (
                  <p style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
                    Battery: {doorData.battery}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
