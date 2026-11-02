import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import CheckSpecificBeach from './pages/CheckSpecificBeach';
import BeachesNearMe from './pages/BeachesNearMe';
import NearestNonRainyBeach from './pages/NearestNonRainyBeach';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/check-specific-beach" element={<CheckSpecificBeach />} />
        <Route path="/beaches-near-me" element={<BeachesNearMe />} />
        <Route path="/nearest-non-rainy" element={<NearestNonRainyBeach />} />
      </Routes>
    </Router>
  );
};

export default App;
