import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">About</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">NZ Beach Weather</h2>
          
          <p className="text-gray-600 mb-4">
            Welcome to NZ Beach Weather, your go-to application for checking weather conditions at beaches across New Zealand.
          </p>
          
          <h3 className="text-xl font-semibold text-blue-800 mb-3">Features:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Check weather for specific beaches by name</li>
            <li>Find beaches within a custom radius from your location</li>
            <li>Discover the nearest beach with sunny weather</li>
            <li>Real-time weather updates</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-blue-800 mb-3">How to Use:</h3>
          <p className="text-gray-600 mb-4">
            Use the navigation menu to access different features. Each page provides intuitive interfaces to help you find the perfect beach for your day out.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> This application uses weather data APIs to provide accurate and up-to-date information for beaches throughout New Zealand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
