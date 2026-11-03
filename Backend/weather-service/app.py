from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
OPENMETEO_BASE_URL = "https://api.open-meteo.com/v1"
API_TOKEN = os.getenv('OPENMETEO_API_TOKEN', '')
PORT = int(os.getenv('PORT', 5001))

def get_weather_condition(code):
    """Convert WMO weather code to readable condition"""
    weather_codes = {
        0: "Clear",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing Rime Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        61: "Slight Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        71: "Slight Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        80: "Slight Showers",
        81: "Moderate Showers",
        82: "Violent Showers",
        95: "Thunderstorm",
        96: "Thunderstorm with Hail",
        99: "Thunderstorm with Heavy Hail"
    }
    return weather_codes.get(code, "Unknown")

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather data for a specific location using OpenMeteo API"""
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid coordinates"}), 400
    
    # Build OpenMeteo API request
    params = {
        'latitude': lat,
        'longitude': lon,
        'current': 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        'timezone': 'auto'
    }
    
    # Add API token if available (for authentication purposes)
    headers = {}
    if API_TOKEN:
        headers['Authorization'] = f'Bearer {API_TOKEN}'
    
    try:
        response = requests.get(f"{OPENMETEO_BASE_URL}/forecast", params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        current = data.get('current', {})
        weather_code = current.get('weather_code', 0)
        
        return jsonify({
            'latitude': lat,
            'longitude': lon,
            'temperature': current.get('temperature_2m'),
            'humidity': current.get('relative_humidity_2m'),
            'wind_speed': current.get('wind_speed_10m'),
            'condition': get_weather_condition(weather_code),
            'weather_code': weather_code,
            'source': 'OpenMeteo API'
        })
        
    except requests.RequestException as e:
        return jsonify({"error": f"Failed to fetch weather data: {str(e)}"}), 500

@app.route('/api/weather/batch', methods=['POST'])
def get_batch_weather():
    """Get weather data for multiple locations"""
    try:
        locations = request.json.get('locations', [])
        if not locations:
            return jsonify({"error": "No locations provided"}), 400
        
        results = []
        for loc in locations:
            lat = loc.get('lat')
            lon = loc.get('lon')
            
            if lat is None or lon is None:
                results.append({
                    'error': 'Invalid coordinates',
                    'location': loc
                })
                continue
            
            params = {
                'latitude': lat,
                'longitude': lon,
                'current': 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
                'timezone': 'auto'
            }
            
            headers = {}
            if API_TOKEN:
                headers['Authorization'] = f'Bearer {API_TOKEN}'
            
            try:
                response = requests.get(f"{OPENMETEO_BASE_URL}/forecast", params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                current = data.get('current', {})
                weather_code = current.get('weather_code', 0)
                
                results.append({
                    'latitude': lat,
                    'longitude': lon,
                    'temperature': current.get('temperature_2m'),
                    'humidity': current.get('relative_humidity_2m'),
                    'wind_speed': current.get('wind_speed_10m'),
                    'condition': get_weather_condition(weather_code),
                    'weather_code': weather_code,
                    'source': 'OpenMeteo API'
                })
                
            except requests.RequestException as e:
                results.append({
                    'error': str(e),
                    'location': loc
                })
        
        return jsonify({'results': results})
        
    except Exception as e:
        return jsonify({"error": f"Batch request failed: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Weather Microservice",
        "api": "OpenMeteo"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=PORT)
