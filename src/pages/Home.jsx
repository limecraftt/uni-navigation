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
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/university-building.jpg)'
        }}
      >
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
      </section>

      <VisitUsSection />
    </>
  );
};

export default Home;