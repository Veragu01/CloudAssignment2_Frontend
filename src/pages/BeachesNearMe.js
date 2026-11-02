import React, { useState } from 'react';

const BeachesNearMe = () => {
  const [radius, setRadius] = useState(50);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const getWeatherEmoji = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('partly')) return '⛅';
    if (conditionLower.includes('wind')) return '💨';
    if (conditionLower.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const getWeatherColor = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return 'from-yellow-400 to-orange-400';
    if (conditionLower.includes('rain')) return 'from-gray-400 to-blue-400';
    if (conditionLower.includes('cloud')) return 'from-gray-300 to-gray-400';
    return 'from-blue-400 to-cyan-400';
  };

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500">
      {/* Animated background elements */}
      <div className="fixed top-20 left-20 text-6xl animate-bounce opacity-50">🏖️</div>
      <div className="fixed top-40 right-32 text-5xl animate-pulse opacity-50">🌊</div>
      <div className="fixed bottom-32 left-40 text-5xl animate-bounce opacity-50">📍</div>
      <div className="fixed bottom-40 right-20 text-6xl animate-pulse opacity-50">🌴</div>
      <div className="fixed top-1/2 left-10 text-4xl animate-spin opacity-30" style={{ animationDuration: '10s' }}>🌈</div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4 animate-pulse">
            📍 Beaches Near Me
          </h1>
          <p className="text-xl text-white font-semibold drop-shadow-md">
            Find beaches within a specific radius from your current location
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
          <p className="text-gray-600 mb-4">Find beaches within a specific radius from your current location.</p>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3 text-lg">📏 Search Radius (km)</label>
            <input
              type="number"
              placeholder="Enter radius in kilometers..."
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min="1"
              max="500"
              className="w-full px-6 py-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg"
            />
          </div>
          
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-400 disabled:transform-none shadow-lg"
          >
            {loading ? '🔄 Finding Beaches...' : '🔍 Find Beaches'}
          </button>
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              {error}
            </div>
          )}
          
          {location && results && (
            <div className="mt-8">
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                <p className="text-blue-800 text-lg">
                  <span className="text-2xl">📍</span> <strong>Your location:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </p>
                <p className="text-blue-800 text-lg mt-2">
                  <span className="text-2xl">🏖️</span> <strong>Found {results.count} beaches within {radius}km</strong>
                </p>
              </div>
              
              {results.beaches.length > 0 ? (
                <div className="space-y-6">
                  {results.beaches.map((beach) => (
                    <div key={beach.id} className={`p-6 rounded-2xl border-4 bg-gradient-to-br ${getWeatherColor(beach.weather.condition)} shadow-xl transform transition-all hover:scale-105`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{beach.name}</h3>
                        <span className="text-5xl animate-bounce">{getWeatherEmoji(beach.weather.condition)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/80 rounded-xl p-3 text-center">
                          <p className="text-gray-600 text-sm">Distance</p>
                          <p className="text-xl font-bold text-blue-800">{beach.distance} km</p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3 text-center">
                          <p className="text-gray-600 text-sm">Region</p>
                          <p className="text-xl font-bold text-blue-800">{beach.region}</p>
                        </div>
                      </div>
                      <div className="bg-white/90 rounded-xl p-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                            <p className="text-gray-600 text-xs">Condition</p>
                            <p className="text-lg font-bold text-orange-800">{beach.weather.condition}</p>
                          </div>
                          <div className="text-center p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
                            <p className="text-gray-600 text-xs">Temp</p>
                            <p className="text-lg font-bold text-red-800">{beach.weather.temperature}°C</p>
                          </div>
                          <div className="text-center p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                            <p className="text-gray-600 text-xs">Wind</p>
                            <p className="text-lg font-bold text-blue-800">{beach.weather.wind_speed} km/h</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 p-6 bg-yellow-100 border-2 border-yellow-300 rounded-xl text-yellow-700 flex items-center gap-3">
                  <span className="text-4xl">😕</span>
                  <span className="text-lg">No beaches found within the specified radius.</span>
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
