// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import StatsSection from '../components/sections/StatsSection';
import VisitUsSection from '../components/sections/VisitUsSection';

const Home = () => {
  return (
    <>
      {/* Mobile: portrait image (hidden on md and above) */}
      <section
        className="relative md:hidden bg-no-repeat"
        style={{
          backgroundImage: 'url(/university-building-mobile.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <StatsSection />
        </div>
      </section>

      {/* Desktop: landscape image (hidden on mobile) */}
      <section
        className="relative hidden md:block bg-no-repeat"
        style={{
          backgroundImage: 'url(/university-building.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          backgroundAttachment: 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
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