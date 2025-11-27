import requests
import random
import time
from datetime import datetime

# Backend API configuration
API_BASE_URL = "http://localhost:8080"

def get_current_setpoint():
    """Fetch the current setpoint from the backend."""
    try:
        response = requests.get(f"{API_BASE_URL}/api/control/latest")
        if response.status_code == 200:
            data = response.json()
            return data.get('setpoint', 20.0)
        else:
            print(f"Failed to fetch setpoint: {response.status_code}")
            return 20.0
    except Exception as e:
        print(f"Error fetching setpoint: {e}")
        return 20.0

def send_sensor_data(temperature, humidity, pressure, air_quality, setpoint):
    """Send sensor data to the backend including the setpoint fetched from backend."""
    try:
        data = {
            "thermostatTemp": str(temperature),
            "humidity": str(humidity),
            "pressure": str(pressure),
            "airQuality": str(air_quality),
            "setpoint": setpoint,
            "date": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        }
        response = requests.post(f"{API_BASE_URL}/api/sensor", json=data)
        if response.status_code == 200:
            print(f"✓ Sensor data sent: Temp={temperature}°C, Humidity={humidity}%, Setpoint={setpoint}°C")
        else:
            print(f"✗ Failed to send sensor data: {response.status_code}")
    except Exception as e:
        print(f"✗ Error sending sensor data: {e}")

def update_led_states(heating_led, cooling_led):
    """Update the LED states in the backend control table."""
    try:
        data = {
            "heatingLedState": heating_led,
            "coolingLedState": cooling_led
        }
        response = requests.post(f"{API_BASE_URL}/api/control/led", json=data)
        if response.status_code == 200:
            print(f"✓ LED states updated: Heating={heating_led}, Cooling={cooling_led}")
        else:
            print(f"✗ Failed to update LED states: {response.status_code}")
    except Exception as e:
        print(f"✗ Error updating LED states: {e}")

def determine_led_states(temperature, setpoint):
    """Determine LED states based on temperature and setpoint with 1°C offset."""
    heating_led = False
    cooling_led = False
    
    # Temperature is 1 degree below setpoint - turn on heating
    if temperature < (setpoint - 1.0):
        heating_led = True
        cooling_led = False
    # Temperature is 1 degree above setpoint - turn on cooling
    elif temperature > (setpoint + 1.0):
        heating_led = False
        cooling_led = True
    # Temperature is within the acceptable range - both off
    else:
        heating_led = False
        cooling_led = False
    
    return heating_led, cooling_led

def main():
    """Main simulation loop."""
    print("=" * 60)
    print("IoT Temperature Control Simulator")
    print("=" * 60)
    print("Starting simulation... Press Ctrl+C to stop")
    print()
    
    # Initialize base temperature around setpoint
    current_temp = 20.0
    
    try:
        while True:
            # Get current setpoint from backend
            setpoint = get_current_setpoint()
            
            # Generate random temperature with some drift
            # Temperature changes gradually (±0.5°C per iteration)
            temp_change = random.uniform(-1.5, 1.5) * 5
            current_temp += temp_change
            
            # Keep temperature in realistic range (15-30°C)
            current_temp = max(15.0, min(30.0, current_temp))
            
            # Round to 1 decimal place
            current_temp = round(current_temp, 1)
            
            # Generate other random sensor data
            humidity = round(random.uniform(30.0, 70.0), 1)
            pressure = round(random.uniform(990.0, 1020.0), 1)
            air_quality = random.choice(["1", "2", "4"])
            
            # Determine LED states based on temperature and setpoint
            heating_led, cooling_led = determine_led_states(current_temp, setpoint)
            
            # Print current state
            print(f"[{datetime.now().strftime('%H:%M:%S')}]")
            print(f"  Temperature: {current_temp}°C | Setpoint: {setpoint}°C")
            print(f"  Heating LED: {'🔴 ON' if heating_led else '⚪ OFF'} | Cooling LED: {'🔵 ON' if cooling_led else '⚪ OFF'}")
            
            # Send data to backend
            send_sensor_data(current_temp, humidity, pressure, air_quality, setpoint)
            update_led_states(heating_led, cooling_led)
            
            print()
            
            # Wait 5 seconds before next iteration
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("Simulation stopped by user")
        print("=" * 60)
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")

if __name__ == "__main__":
    main()
