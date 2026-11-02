import React, { useState } from 'react';

const BeachesNearMe = () => {
  const [radius, setRadius] = useState(50);
  const [results, setResults] = useState(null);
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
    setResults(null);

    try {
      const userLocation = await getLocation();
      setLocation(userLocation);

      const response = await fetch(
        `http://localhost:5000/api/beaches/near?lat=${userLocation.lat}&lon=${userLocation.lon}&radius=${radius}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new data.error || 'Failed to fetch nearby beaches';
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch beach data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Beaches Near Me</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <p className="text-gray-600 mb-4">Find beaches within a specific radius from your current location.</p>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Search Radius (km)</label>
            <input
              type="number"
              placeholder="Enter radius in kilometers..."
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min="1"
              max="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Finding Beaches...' : 'Find Beaches'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {location && results && (
            <div className="mt-6">
              <p className="text-gray-600 mb-3">
                <strong>Your location:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </p>
              <p className="text-gray-600 mb-3">
                <strong>Found {results.count} beaches within {radius}km</strong>
              </p>
              
              {results.beaches.length > 0 ? (
                <div className="space-y-4">
                  {results.beaches.map((beach) => (
                    <div key={beach.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-blue-900">{beach.name}</h3>
                      <p className="text-gray-600"><strong>Distance:</strong> {beach.distance} km</p>
                      <p className="text-gray-600"><strong>Region:</strong> {beach.region}</p>
                      <div className="mt-2 p-3 bg-blue-50 rounded">
                        <p className="text-gray-700"><strong>Condition:</strong> {beach.weather.condition}</p>
                        <p className="text-gray-700"><strong>Temperature:</strong> {beach.weather.temperature}°C</p>
                        <p className="text-gray-700"><strong>Wind:</strong> {beach.weather.wind_speed} km/h</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                  No beaches found within the specified radius.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeachesNearMe;
