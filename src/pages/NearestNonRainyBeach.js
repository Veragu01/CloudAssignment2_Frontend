import React from 'react';

const NearestNonRainyBeach = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Nearest Non-Rainy Beach</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <p className="text-gray-600 mb-4">Find the closest beach to your location that is not currently experiencing rain.</p>
          
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Find Nearest Sunny Beach
          </button>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-center">Nearest non-rainy beach will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearestNonRainyBeach;
