// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import StatsSection from '../components/sections/StatsSection';
import VisitUsSection from '../components/sections/VisitUsSection';

const Home = () => {
  return (
    <>
      {/* Mobile: portrait image */}
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
          <StatsSection />
        </div>
      </section>

      {/* Desktop: landscape image */}
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
          <StatsSection />
        </div>
      </section>

      {/* Features on their own clean section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">What We Offer</h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Everything you need to navigate and explore the University of Embu campus.
            </p>
          </div>
          <FeaturesSection />
        </div>
      </section>

      <VisitUsSection />
    </>
  );
};

export default Home;