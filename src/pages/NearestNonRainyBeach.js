import React, { useState } from 'react';

const NearestNonRainyBeach = () => {
  const [result, setResult] = useState(null);
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
    setResult(null);

    try {
      const userLocation = await getLocation();
      setLocation(userLocation);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/beaches/nearest-non-rainy?lat=${userLocation.lat}&lon=${userLocation.lon}`
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
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-500">
      {/* Animated background elements */}
      <div className="fixed top-20 left-20 text-6xl animate-bounce opacity-50">☀️</div>
      <div className="fixed top-40 right-32 text-5xl animate-pulse opacity-50">🌊</div>
      <div className="fixed bottom-32 left-40 text-5xl animate-bounce opacity-50">🏖️</div>
      <div className="fixed bottom-40 right-20 text-6xl animate-pulse opacity-50">🌴</div>
      <div className="fixed top-1/2 left-10 text-4xl animate-spin opacity-30" style={{ animationDuration: '10s' }}>🌈</div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4 animate-pulse">
            ☀️ Nearest Non-Rainy Beach
          </h1>
          <p className="text-xl text-white font-semibold drop-shadow-md">
            Find the closest beach to your location that is not currently experiencing rain
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-400 disabled:transform-none shadow-lg"
          >
            {loading ? '🔄 Searching...' : '🌞 Find Nearest Sunny Beach'}
          </button>
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              {error}
            </div>
          )}
          
          {location && result && (
            <div className={`mt-8 p-6 rounded-2xl border-4 bg-gradient-to-br ${getWeatherColor(result.weather.condition)} shadow-2xl transform transition-all hover:scale-105`}>
              <div className="text-center mb-6">
                <span className="text-8xl animate-bounce">{getWeatherEmoji(result.weather.condition)}</span>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg mt-4">{result.name}</h2>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                <p className="text-blue-800 text-lg">
                  <span className="text-2xl">📍</span> <strong>Your location:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <p className="text-gray-600 text-sm">Distance</p>
                  <p className="text-2xl font-bold text-blue-800">{result.distance} km</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <p className="text-gray-600 text-sm">Region</p>
                  <p className="text-2xl font-bold text-blue-800">{result.region}</p>
                </div>
              </div>
              
              <div className="bg-white/90 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">🌡️ Weather Conditions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                    <p className="text-gray-600 text-sm">Condition</p>
                    <p className="text-xl font-bold text-orange-800">{result.weather.condition}</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl">
                    <p className="text-gray-600 text-sm">Temperature</p>
                    <p className="text-xl font-bold text-red-800">{result.weather.temperature}°C</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                    <p className="text-gray-600 text-sm">Wind Speed</p>
                    <p className="text-xl font-bold text-blue-800">{result.weather.wind_speed} km/h</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl">
                    <p className="text-gray-600 text-sm">Humidity</p>
                    <p className="text-xl font-bold text-green-800">{result.weather.humidity}%</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl col-span-2">
                    <p className="text-gray-600 text-sm">Wave Height</p>
                    <p className="text-xl font-bold text-purple-800">{result.weather.wave_height}m</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearestNonRainyBeach;
