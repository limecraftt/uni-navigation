// src/components/ui/FeatureCard.jsx
import React from 'react';

const FeatureCard = ({ icon, title, description, variant = 'dark' }) => {
  if (variant === 'light') {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-sm">
        <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-blue-600">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    );
  }

  // Default dark variant (for use over background images)
  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center hover:bg-white/25 transition-all duration-300 transform hover:scale-105 shadow-xl">
      <div className="bg-blue-500/30 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-300/50">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;