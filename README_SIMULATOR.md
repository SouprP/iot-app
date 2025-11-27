# IoT Temperature Control Simulator

## Description
Python script that simulates an IoT temperature sensor and controller.

## Features
- Generates random temperature data every 5 seconds
- Fetches current setpoint from the backend
- Implements 1°C offset logic:
  - **Heating LED ON**: Temperature < (Setpoint - 1°C)
  - **Cooling LED ON**: Temperature > (Setpoint + 1°C)
  - **Both LEDs OFF**: Temperature within acceptable range
- Sends sensor data and control state to the backend

## Requirements
```bash
pip install requests
```

## Usage
```bash
python simulator.py
```

## How it Works
1. Continuously monitors and generates temperature readings
2. Compares temperature with setpoint from backend
3. Updates LED states based on temperature difference
4. Sends both sensor data and control state to backend API
5. Displays real-time status in console

Press `Ctrl+C` to stop the simulation.
