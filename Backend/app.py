from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import random

app = Flask(__name__)
CORS(app)

# Sample NZ beach data with coordinates and simulated weather
BEACHES = [
    {
        "id": 1,
        "name": "Piha Beach",
        "latitude": -36.9500,
        "longitude": 174.4667,
        "region": "Auckland"
    },
    {
        "id": 2,
        "name": "Mission Bay",
        "latitude": -36.8536,
        "longitude": 174.8269,
        "region": "Auckland"
    },
    {
        "id": 3,
        "name": "Takapuna Beach",
        "latitude": -36.7867,
        "longitude": 174.7667,
        "region": "Auckland"
    },
    {
        "id": 4,
        "name": "Mount Maunganui Beach",
        "latitude": -37.6333,
        "longitude": 176.1833,
        "region": "Bay of Plenty"
    },
    {
        "id": 5,
        "name": "Ohope Beach",
        "latitude": -37.7333,
        "longitude": 177.0500,
        "region": "Bay of Plenty"
    },
    {
        "id": 6,
        "name": "Whale Bay",
        "latitude": -37.4500,
        "longitude": 175.8333,
        "region": "Waikato"
    },
    {
        "id": 7,
        "name": "Raglan Beach",
        "latitude": -37.8000,
        "longitude": 174.8833,
        "region": "Waikato"
    },
    {
        "id": 8,
        "name": "Hot Water Beach",
        "latitude": -36.8833,
        "longitude": 175.9167,
        "region": "Waikato"
    },
    {
        "id": 9,
        "name": "Cathedral Cove Beach",
        "latitude": -36.8333,
        "longitude": 175.7833,
        "region": "Waikato"
    },
    {
        "id": 10,
        "name": "Wainui Beach",
        "latitude": -38.6667,
        "longitude": 178.0167,
        "region": "Gisborne"
    },
    {
        "id": 11,
        "name": "Lyall Bay",
        "latitude": -41.3333,
        "longitude": 174.7833,
        "region": "Wellington"
    },
    {
        "id": 12,
        "name": "Oriental Bay",
        "latitude": -41.2833,
        "longitude": 174.8000,
        "region": "Wellington"
    },
    {
        "id": 13,
        "name": "Sumner Beach",
        "latitude": -43.5667,
        "longitude": 172.7333,
        "region": "Canterbury"
    },
    {
        "id": 14,
        "name": "New Brighton Beach",
        "latitude": -43.5333,
        "longitude": 172.7333,
        "region": "Canterbury"
    },
    {
        "id": 15,
        "name": "Moeraki Beach",
        "latitude": -45.3500,
        "longitude": 170.8333,
        "region": "Otago"
    }
]

def get_simulated_weather(beach_id):
    """Simulate weather data for a beach"""
    weather_conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy", "Windy"]
    condition = random.choice(weather_conditions)
    
    # Generate realistic temperature based on condition
    if condition == "Sunny":
        temp = random.randint(20, 28)
    elif condition == "Rainy":
        temp = random.randint(12, 18)
    else:
        temp = random.randint(15, 24)
    
    return {
        "beach_id": beach_id,
        "condition": condition,
        "temperature": temp,
        "wind_speed": random.randint(5, 30),
        "humidity": random.randint(40, 90),
        "wave_height": round(random.uniform(0.5, 3.0), 1)
    }

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates in kilometers using Haversine formula"""
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon / 2) ** 2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    
    return distance

@app.route('/api/beaches', methods=['GET'])
def get_all_beaches():
    """Get all beaches"""
    return jsonify({"beaches": BEACHES})

@app.route('/api/beaches/<int:beach_id>', methods=['GET'])
def get_beach(beach_id):
    """Get a specific beach by ID"""
    beach = next((b for b in BEACHES if b["id"] == beach_id), None)
    if beach:
        return jsonify(beach)
    return jsonify({"error": "Beach not found"}), 404

@app.route('/api/beaches/search', methods=['GET'])
def search_beach():
    """Search for a beach by name"""
    query = request.args.get('name', '').lower()
    if not query:
        return jsonify({"error": "Name parameter is required"}), 400
    
    matching_beaches = [b for b in BEACHES if query in b["name"].lower()]
    
    if matching_beaches:
        # Get weather for the first match
        beach = matching_beaches[0]
        weather = get_simulated_weather(beach["id"])
        return jsonify({
            "beach": beach,
            "weather": weather
        })
    
    return jsonify({"error": "Beach not found"}), 404

@app.route('/api/beaches/near', methods=['GET'])
def beaches_near_me():
    """Find beaches within a radius of a location"""
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        radius = float(request.args.get('radius', 10))  # Default 10km
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid coordinates or radius"}), 400
    
    nearby_beaches = []
    for beach in BEACHES:
        distance = calculate_distance(lat, lon, beach["latitude"], beach["longitude"])
        if distance <= radius:
            weather = get_simulated_weather(beach["id"])
            nearby_beaches.append({
                **beach,
                "distance": round(distance, 2),
                "weather": weather
            })
    
    # Sort by distance
    nearby_beaches.sort(key=lambda x: x["distance"])
    
    return jsonify({
        "beaches": nearby_beaches,
        "count": len(nearby_beaches)
    })

@app.route('/api/beaches/nearest-non-rainy', methods=['GET'])
def nearest_non_rainy():
    """Find the nearest beach without rain"""
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid coordinates"}), 400
    
    beaches_with_distance = []
    for beach in BEACHES:
        distance = calculate_distance(lat, lon, beach["latitude"], beach["longitude"])
        weather = get_simulated_weather(beach["id"])
        beaches_with_distance.append({
            **beach,
            "distance": round(distance, 2),
            "weather": weather
        })
    
    # Filter non-rainy beaches
    non_rainy = [b for b in beaches_with_distance if b["weather"]["condition"] != "Rainy"]
    
    if non_rainy:
        non_rainy.sort(key=lambda x: x["distance"])
        return jsonify(non_rainy[0])
    
    return jsonify({"error": "No non-rainy beaches found"}), 404

@app.route('/api/weather/<int:beach_id>', methods=['GET'])
def get_weather(beach_id):
    """Get weather for a specific beach"""
    beach = next((b for b in BEACHES if b["id"] == beach_id), None)
    if beach:
        weather = get_simulated_weather(beach_id)
        return jsonify(weather)
    return jsonify({"error": "Beach not found"}), 404

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "NZ Beach Weather API"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
