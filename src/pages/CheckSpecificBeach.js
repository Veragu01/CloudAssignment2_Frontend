import React from 'react';

const CheckSpecificBeach = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Check Specific Beach</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <p className="text-gray-600 mb-4">Search for a specific beach in New Zealand to check its weather conditions.</p>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Beach Name</label>
            <input
              type="text"
              placeholder="Enter beach name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Search Beach
          </button>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-center">Weather results will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckSpecificBeach;
