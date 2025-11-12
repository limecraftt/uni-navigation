import React from 'react';

const StatCard = ({ number, label }) => {
  return (
    <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-6 shadow-lg hover:bg-white/20 transition-all duration-300">
      <div className="text-3xl font-bold text-blue-200 mb-2">{number}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  );
};

export default StatCard;