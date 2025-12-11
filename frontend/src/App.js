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
    setPoint: 20.0
  });

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllData();
    };
    
    fetchData();
    fetchCurrentSetpoint(); 

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentSetpoint = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/setpoint`);
      const val = response.data;
      if (typeof val === 'number') {
        setThermostatData(prev => ({ ...prev, setPoint: val }));
      } else {
        console.warn('Unexpected setpoint format:', val);
      }
    } catch (error) {
      console.error('Error fetching setpoint:', error);
    }
  };

  const updateSetpoint = async (newSetpoint) => {
    try {
      const floatValue = parseFloat(newSetpoint);
      setThermostatData(prev => ({ ...prev, setPoint: floatValue }));
      await axios.post(`${API_BASE_URL}/api/setpoint`, {
        desiredSetpoint: floatValue 
      });
    } catch (error) {
      console.error('Error updating setpoint:', error);
      fetchCurrentSetpoint();
    }
  };

  const handleSetpointChange = (change) => {
    const current = parseFloat(thermostatData.setPoint);
    const newVal = Math.round((current + change) * 10) / 10;
    updateSetpoint(newVal);
  };

  const fetchAllData = async () => {
    try {
      // 1. Fetch thermostat data
      const thermostatResponse = await axios.get(`${API_BASE_URL}/api/thermostat?amount=12`);
      const thermostatArray = thermostatResponse.data; 
      
      // 2. Fetch CO2 sensor data
      const co2Response = await axios.get(`${API_BASE_URL}/api/co2?amount=12`);
      const co2Array = co2Response.data;

      if (co2Array && co2Array.length > 0) {
        setCo2Data(co2Array[0]);
      }
      
      // 3. Fetch door sensor data
      const doorResponse = await axios.get(`${API_BASE_URL}/api/door?amount=1`);
      if (doorResponse.data && doorResponse.data.length > 0) {
        setDoorData(doorResponse.data[0]);
      }
      
      if (thermostatArray.length > 0) {
        const isHeaterOn = thermostatArray[0].heater;
        setThermostatData(prev => ({
          ...prev,
          heater: isHeaterOn
        }));
      }
      
      const fullTimeRange = [];
      for (let i = 0; i < 12; i++) {
        const timeInSeconds = (11 - i) * 5; 
        fullTimeRange.push({
          timeLabel: `${timeInSeconds}s`,
          timeValue: timeInSeconds,
          setpoint: null,
          temperature: null,
          humidity: null,
          co2: null   
        });
      }
      
      // Map Thermostat
      const chartThermostatData = [...thermostatArray].reverse(); 
      const thermCount = chartThermostatData.length;
      chartThermostatData.forEach((item, index) => {
        const position = 12 - thermCount + index;
        if (position >= 0 && position < 12) {
          fullTimeRange[position].setpoint = item.setPoint;
        }
      });

      // Map CO2 / Humidity / Temperature
      const chartCo2Data = [...co2Array].reverse();
      const co2Count = chartCo2Data.length;
      
      chartCo2Data.forEach((item, index) => {
        const position = 12 - co2Count + index;
        if (position >= 0 && position < 12) {
          fullTimeRange[position].temperature = item.temperatureC;
          fullTimeRange[position].humidity = item.humidityRh;
          fullTimeRange[position].co2 = item.co2Ppm;
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
                            {entry.name}: {entry.value !== null ? entry.value : '--'}
                          </div>
                        ))}

                        <div style={{ color: '#8b5cf6', marginTop: '5px' }}>
                           Humidity: {data.humidity != null ? `${data.humidity}%` : '--'}
                        </div>

                        <div style={{ color: '#06b6d4' }}>
                           CO2: {data.co2 != null ? `${data.co2} ppm` : '--'}
                        </div>
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
                      {/* Lines Legend */}
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
                          <span style={{ marginRight: '20px', color: '#8b5cf6' }}>
                            <span style={{ 
                              display: 'inline-block', 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: '#8b5cf6',
                              marginRight: '5px',
                              verticalAlign: 'middle'
                            }}></span>
                            Humidity (%)
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
                            CO2 (ppm)
                          </span>
                        </>
                      )}
                    </div>
                  );
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ff7300" 
                name="Temperature (°C)"
                strokeWidth={2}
                connectNulls={true}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
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
            <div className="stepper-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <button 
                onClick={() => handleSetpointChange(-0.5)}
                style={{
                  padding: '10px 20px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              >
                -
              </button>
              
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {Number(thermostatData.setPoint).toFixed(1)}°C
                </span>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Target</p>
              </div>

              <button 
                onClick={() => handleSetpointChange(0.5)}
                style={{
                  padding: '10px 20px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              >
                +
              </button>
            </div>
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
                    backgroundColor: doorData?.doorOpen ? '#22c55e' : '#ff4444',
                    border: '3px solid black',
                    boxShadow: doorData?.doorOpen ? '0 0 20px rgba(34, 197, 94, 0.8)' : '0 0 20px rgba(255, 68, 68, 0.8)'
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