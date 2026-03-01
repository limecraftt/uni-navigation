// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import StatsSection from '../components/sections/StatsSection';
import VisitUsSection from '../components/sections/VisitUsSection';

const Home = () => {
  return (
    <>
      {/* Continuous Hero + Features Section with University Building Background */}
      <section 
        className="relative bg-no-repeat"
        style={{
          backgroundImage: 'url(/university-building.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'scroll', // 'fixed' causes zoom issues on mobile
        }}
      >
        {/* Dark overlay to improve text readability on mobile */}
        <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
        
        {/* Content needs relative positioning to sit above overlay */}
        <div className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <StatsSection />
        </div>
      </section>

      <VisitUsSection />
    </>
  );
};

export default Home;