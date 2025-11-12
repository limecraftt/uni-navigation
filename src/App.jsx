import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import CampusMap from './pages/CampusMap';
import VirtualTour from './pages/VirtualTour';
import Directions from './pages/Directions';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campus-map" element={<CampusMap />} />
            <Route path="/virtual-tour" element={<VirtualTour />} />
            <Route path="/directions" element={<Directions />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;