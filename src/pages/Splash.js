import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className={`absolute top-20 left-20 text-8xl animate-bounce ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        ☀️
      </div>
      <div className={`absolute top-40 right-32 text-7xl animate-pulse ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-200`}>
        🌊
      </div>
      <div className={`absolute bottom-32 left-40 text-6xl animate-bounce ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-300`}>
        🏖️
      </div>
      <div className={`absolute bottom-40 right-20 text-8xl animate-pulse ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-500`}>
        🌴
      </div>
      <div className={`absolute top-1/2 left-10 text-5xl animate-spin ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-700`} style={{ animationDuration: '3s' }}>
        🌈
      </div>
      <div className={`absolute top-1/3 right-10 text-5xl animate-bounce ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-400`}>
        ⛱️
      </div>

      {/* Main content */}
      <div className={`text-center z-10 transform transition-all duration-1000 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-white drop-shadow-lg mb-4 animate-pulse">
            🏖️ NZ Beach Weather
          </h1>
          <p className="text-3xl text-white font-semibold drop-shadow-md">
            Discover Your Perfect Beach Day!
          </p>
        </div>

        <div className="flex justify-center gap-8 mb-12 text-6xl">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>☀️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌤️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>⛅</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🌧️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🌈</span>
        </div>

        {showButton && (
          <button
            onClick={handleEnter}
            className="bg-white text-orange-600 px-12 py-4 rounded-full text-2xl font-bold shadow-2xl hover:scale-110 transition-transform duration-300 animate-bounce"
          >
            Start Exploring 🚀
          </button>
        )}
      </div>

      {/* Floating clouds */}
      <div className="absolute top-10 left-1/4 text-6xl animate-float opacity-80">
        ☁️
      </div>
      <div className="absolute top-20 right-1/4 text-5xl animate-float opacity-60" style={{ animationDelay: '2s' }}>
        ☁️
      </div>
    </div>
  );
};

export default Splash;
