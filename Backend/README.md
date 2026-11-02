# NZ Beach Weather Backend

Flask backend API for the NZ Beach Weather application.

## Features

- **Check Specific Beach**: Search for a beach by name and get weather data
- **Beaches Near Me**: Find beaches within a radius from a location
- **Nearest Non-Rainy Beach**: Find the closest beach without rain
- **Weather Data**: Simulated weather conditions for NZ beaches

## Installation

### Linux/Mac:

**Note for Arch-based systems (Arch, CachyOS, Manjaro, etc.):**
If pip is not installed, install it first:
```bash
sudo pacman -S python-pip
```

1. Create a virtual environment:
```bash
python3 -m venv venv
```

2. Install dependencies (using venv python directly):
```bash
venv/bin/python -m pip install -r requirements.txt
```

3. Run the server:
```bash
venv/bin/python app.py
```

**Note:** On Arch-based systems with fish shell, use `venv/bin/python` directly instead of sourcing the activate script.

### Windows:
1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### GET /api/beaches
Get all beaches

### GET /api/beaches/<id>
Get a specific beach by ID

### GET /api/beaches/search?name=<beach_name>
Search for a beach by name (returns weather data)

### GET /api/beaches/near?lat=<latitude>&lon=<longitude>&radius=<km>
Find beaches within a radius of a location

### GET /api/beaches/nearest-non-rainy?lat=<latitude>&lon=<longitude>
Find the nearest beach without rain

### GET /api/weather/<beach_id>
Get weather for a specific beach

### GET /api/health
Health check endpoint

## Sample Data

The backend includes 15 popular NZ beaches with coordinates and simulated weather data.

## CORS

CORS is enabled to allow requests from the React frontend running on port 3000.
