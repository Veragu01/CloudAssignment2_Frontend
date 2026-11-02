# Docker Setup Guide

This document explains how to run the NZ Beach Weather application using Docker containers.

## Architecture

The application consists of three services:

1. **Frontend**: React application served via Nginx (port 80)
2. **Backend**: Flask API for beach data and business logic (port 5000)
3. **Weather Microservice**: Python Flask service that calls OpenMeteo API (port 5001)

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually included with Docker Desktop)

## Environment Variables

Create a `.env` file in the root directory with your OpenMeteo API token:

```bash
OPENMETEO_API_TOKEN=your_api_token_here
```

Note: OpenMeteo API is free and doesn't require authentication, but the microservice supports token-based authentication for future use or if using a paid tier.

## Building and Running

### Using Docker Compose (Recommended)

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the application at `http://localhost`

3. To stop the services:
```bash
docker-compose down
```

### Running Individual Services

#### Backend
```bash
cd Backend
docker build -t beach-weather-backend .
docker run -p 5000:5000 beach-weather-backend
```

#### Weather Microservice
```bash
cd weather-service
docker build -t beach-weather-service .
docker run -p 5001:5001 -e OPENMETEO_API_TOKEN=your_token beach-weather-service
```

#### Frontend
```bash
docker build -t beach-weather-frontend .
docker run -p 80:80 beach-weather-frontend
```

## Service Communication

- Frontend communicates with Backend via Nginx proxy on `/api` routes
- Backend communicates with Weather Microservice via internal Docker network
- Weather Microservice calls OpenMeteo API externally

## API Endpoints

### Backend (http://localhost:5000)
- `GET /api/beaches` - Get all beaches
- `GET /api/beaches/<id>` - Get specific beach
- `GET /api/beaches/search?name=<name>` - Search beach by name
- `GET /api/beaches/near?lat=<lat>&lon=<lon>&radius=<km>` - Find beaches near location
- `GET /api/beaches/nearest-non-rainy?lat=<lat>&lon=<lon>` - Find nearest non-rainy beach
- `GET /api/weather/<id>` - Get weather for specific beach
- `GET /api/health` - Health check

### Weather Microservice (http://localhost:5001)
- `GET /api/weather?lat=<lat>&lon=<lon>` - Get weather for coordinates
- `POST /api/weather/batch` - Get weather for multiple locations
- `GET /api/health` - Health check

## Troubleshooting

### Services not starting
- Check if ports 80, 5000, and 5001 are already in use
- Run `docker-compose logs` to see error messages

### Weather data showing as simulated
- The backend has a fallback mechanism. If the weather microservice is unavailable, it will use simulated data
- Check the weather microservice logs: `docker-compose logs weather-service`

### Frontend not loading
- Ensure the backend service is running
- Check Nginx configuration in `nginx.conf`

## Development Mode

For development without Docker:

1. **Backend**:
```bash
cd Backend
pip install -r requirements.txt
python app.py
```

2. **Weather Microservice**:
```bash
cd weather-service
pip install -r requirements.txt
python app.py
```

3. **Frontend**:
```bash
npm install
npm start
```
