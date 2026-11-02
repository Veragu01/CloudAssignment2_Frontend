import React, { useState } from 'react';

const NearestNonRainyBeach = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          reject(new Error('Unable to retrieve your location. Please enable location services.'));
        }
      );
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const userLocation = await getLocation();
      setLocation(userLocation);

      const response = await fetch(
        `http://localhost:5000/api/beaches/nearest-non-rainy?lat=${userLocation.lat}&lon=${userLocation.lon}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new data.error || 'Failed to find nearest non-rainy beach';
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch beach data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Nearest Non-Rainy Beach</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <p className="text-gray-600 mb-4">Find the closest beach to your location that is not currently experiencing rain.</p>
          
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Find Nearest Sunny Beach'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {location && result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-3">
                <strong>Your location:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </p>
              
              <h2 className="text-xl font-bold text-blue-900 mb-3">{result.name}</h2>
              <p className="text-gray-600 mb-2"><strong>Distance:</strong> {result.distance} km</p>
              <p className="text-gray-600 mb-2"><strong>Region:</strong> {result.region}</p>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Weather Conditions</h3>
                <p className="text-gray-700"><strong>Condition:</strong> {result.weather.condition}</p>
                <p className="text-gray-700"><strong>Temperature:</strong> {result.weather.temperature}°C</p>
                <p className="text-gray-700"><strong>Wind Speed:</strong> {result.weather.wind_speed} km/h</p>
                <p className="text-gray-700"><strong>Humidity:</strong> {result.weather.humidity}%</p>
                <p className="text-gray-700"><strong>Wave Height:</strong> {result.weather.wave_height}m</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearestNonRainyBeach;
