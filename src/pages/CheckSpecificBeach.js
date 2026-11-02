import React, { useState, useEffect } from 'react';

const CheckSpecificBeach = () => {
  const [beaches, setBeaches] = useState([]);
  const [selectedBeach, setSelectedBeach] = useState('');
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    const loadBeaches = async () => {
      setLoading(true);
      try {
        const userLocation = await getLocation();
        setLocation(userLocation);

        const response = await fetch('http://localhost:5000/api/beaches');
        const data = await response.json();

        if (!response.ok) {
          throw new data.error || 'Failed to fetch beaches';
        }

        // Sort beaches by distance from user
        const sortedBeaches = data.beaches.map(beach => ({
          ...beach,
          distance: calculateDistance(userLocation.lat, userLocation.lon, beach.latitude, beach.longitude)
        })).sort((a, b) => a.distance - b.distance);

        setBeaches(sortedBeaches);
      } catch (err) {
        setError(err.message || 'Failed to load beaches');
      } finally {
        setLoading(false);
      }
    };

    loadBeaches();
  }, []);

  const handleSearch = async () => {
    if (!selectedBeach) {
      setError('Please select a beach');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const beach = beaches.find(b => b.id === parseInt(selectedBeach));
      if (!beach) {
        throw new Error('Beach not found');
      }

      const response = await fetch(`http://localhost:5000/api/weather/${beach.id}`);
      const weatherData = await response.json();

      if (!response.ok) {
        throw new weatherData.error || 'Failed to fetch weather';
      }

      setResult({ beach, weather: weatherData });
    } catch (err) {
      setError(err.message || 'Failed to fetch beach data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Check Specific Beach</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <p className="text-gray-600 mb-4">Select a beach to check its weather conditions. Beaches are sorted by distance from your location.</p>
          
          {location && (
            <p className="text-gray-600 mb-4 text-sm">
              <strong>Your location:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
            </p>
          )}
          
          {loading && beaches.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading beaches...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Select Beach</label>
                <select
                  value={selectedBeach}
                  onChange={(e) => setSelectedBeach(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a beach --</option>
                  {beaches.map(beach => (
                    <option key={beach.id} value={beach.id}>
                      {beach.name} ({beach.distance.toFixed(1)} km) - {beach.region}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleSearch}
                disabled={loading || !selectedBeach}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Loading...' : 'Check Weather'}
              </button>
            </>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-blue-900 mb-3">{result.beach.name}</h2>
              <p className="text-gray-600 mb-2"><strong>Distance:</strong> {result.beach.distance.toFixed(1)} km</p>
              <p className="text-gray-600 mb-2"><strong>Region:</strong> {result.beach.region}</p>
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

export default CheckSpecificBeach;
