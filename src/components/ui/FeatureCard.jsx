import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center hover:bg-white/25 transition-all duration-300 transform hover:scale-105 shadow-xl">
      <div className="bg-blue-500/30 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-300/50">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-blue-100 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;