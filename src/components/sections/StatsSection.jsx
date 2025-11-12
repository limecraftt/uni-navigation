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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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