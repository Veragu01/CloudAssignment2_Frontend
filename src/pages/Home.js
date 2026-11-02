import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
    const R = 6371;
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

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/beaches`);
        const data = await response.json();

        if (!response.ok) {
          throw new data.error || 'Failed to fetch beaches';
        }

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

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/weather/${beach.id}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500">
      {/* Animated background elements */}
      <div className="fixed top-20 left-20 text-6xl animate-bounce opacity-50">☀️</div>
      <div className="fixed top-40 right-32 text-5xl animate-pulse opacity-50">🌊</div>
      <div className="fixed bottom-32 left-40 text-5xl animate-bounce opacity-50">🏖️</div>
      <div className="fixed bottom-40 right-20 text-6xl animate-pulse opacity-50">🌴</div>
      <div className="fixed top-1/2 left-10 text-4xl animate-spin opacity-30" style={{ animationDuration: '10s' }}>🌈</div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/check-specific-beach"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              🔍 Check Specific Beach
            </Link>
            <Link
              to="/beaches-near-me"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              📍 Beaches Near Me
            </Link>
            <Link
              to="/nearest-non-rainy"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg"
            >
              ☀️ Nearest Sunny Beach
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4 animate-pulse">
            🏖️ NZ Beach Weather
          </h1>
          <p className="text-2xl text-white font-semibold drop-shadow-md">
            Your go-to application for checking weather conditions at beaches across New Zealand
          </p>
        </div>

        {/* About Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-3">
            <span className="text-4xl">📖</span> About
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-3">✨ Features:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li className="flex items-center gap-2"><span className="text-2xl">🏝️</span> Check weather for specific beaches by name</li>
                <li className="flex items-center gap-2"><span className="text-2xl">📍</span> Find beaches within a custom radius from your location</li>
                <li className="flex items-center gap-2"><span className="text-2xl">☀️</span> Discover the nearest beach with sunny weather</li>
                <li className="flex items-center gap-2"><span className="text-2xl">🔄</span> Real-time weather updates</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 How to Use:</h3>
              <p className="text-gray-700">
                Use the navigation menu to access different features. Each page provides intuitive interfaces to help you find the perfect beach for your day out. Simply select a beach below to get started!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 border-2 border-yellow-300">
              <p className="text-orange-800">
                <span className="text-2xl">💡</span> <strong>Note:</strong> This application uses weather data APIs to provide accurate and up-to-date information for beaches throughout New Zealand.
              </p>
            </div>
          </div>
        </div>

        {/* Beach Search Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-3">
            <span className="text-4xl">🔍</span> Check Specific Beach
          </h2>
          
          <p className="text-gray-600 mb-6 text-lg">Select a beach to check its weather conditions. Beaches are sorted by distance from your location.</p>
          
          {location && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
              <p className="text-blue-800">
                <span className="text-2xl">📍</span> <strong>Your location:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </p>
            </div>
          )}
          
          {loading && beaches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl animate-spin mb-4">🔄</div>
              <p className="text-gray-600 text-xl">Loading beaches...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3 text-lg">Select Beach</label>
                <select
                  value={selectedBeach}
                  onChange={(e) => setSelectedBeach(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-lg bg-white"
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-400 disabled:transform-none shadow-lg"
              >
                {loading ? '🔄 Loading...' : '🌊 Check Weather'}
              </button>
            </>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              {error}
            </div>
          )}
          
          {result && (
            <div className={`mt-8 p-6 rounded-2xl border-4 bg-gradient-to-br ${getWeatherColor(result.weather.condition)} shadow-2xl transform transition-all hover:scale-105`}>
              <div className="text-center mb-6">
                <span className="text-8xl animate-bounce">{getWeatherEmoji(result.weather.condition)}</span>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg mt-4">{result.beach.name}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <p className="text-gray-600 text-sm">Distance</p>
                  <p className="text-2xl font-bold text-purple-800">{result.beach.distance.toFixed(1)} km</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <p className="text-gray-600 text-sm">Region</p>
                  <p className="text-2xl font-bold text-purple-800">{result.beach.region}</p>
                </div>
              </div>
              
              <div className="bg-white/90 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center">🌡️ Weather Conditions</h3>
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

export default Home;
