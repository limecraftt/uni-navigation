// src/components/sections/StatsSection.jsx
import React from 'react';
import StatCard from '../ui/StatCard';
import { STATS } from '../../utils/constants';

const StatsSection = () => {
  const stats = [
    {
      number: STATS.LOCATIONS.number,
      label: STATS.LOCATIONS.label
    },
    {
      number: STATS.STUDENTS.number,
      label: STATS.STUDENTS.label
    },
    {
      number: STATS.PROGRAMS.number,
      label: STATS.PROGRAMS.label
    }
  ];

  return (
    // Hidden on mobile, visible on desktop
    <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-3 gap-8 text-center">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            number={stat.number}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;