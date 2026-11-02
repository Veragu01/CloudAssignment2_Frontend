import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CheckSpecificBeach from './pages/CheckSpecificBeach';
import BeachesNearMe from './pages/BeachesNearMe';
import NearestNonRainyBeach from './pages/NearestNonRainyBeach';
import About from './pages/About';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-blue-900 hover:bg-blue-100'
      }`}
    >
      {children}
    </Link>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-900">🏖️ NZ Beach Weather</h1>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <NavLink to="/check-specific-beach">Check Specific Beach</NavLink>
                <NavLink to="/beaches-near-me">Beaches Near Me</NavLink>
                <NavLink to="/nearest-non-rainy">Nearest Non-Rainy Beach</NavLink>
                <NavLink to="/about">About</NavLink>
              </div>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<CheckSpecificBeach />} />
          <Route path="/check-specific-beach" element={<CheckSpecificBeach />} />
          <Route path="/beaches-near-me" element={<BeachesNearMe />} />
          <Route path="/nearest-non-rainy" element={<NearestNonRainyBeach />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
