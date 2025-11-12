import React from 'react';
import FeatureCard from '../ui/FeatureCard';
import { MapIcon, CameraIcon, NavigationIcon } from '../../assets/icons/svgIcons';
import { FEATURES } from '../../utils/constants';

const FeaturesSection = () => {
  const features = [
    {
      icon: <MapIcon className="w-8 h-8 text-blue-100" />,
      title: FEATURES.INTERACTIVE_MAPS.title,
      description: FEATURES.INTERACTIVE_MAPS.description
    },
    {
      icon: <CameraIcon className="w-8 h-8 text-blue-100" />,
      title: FEATURES.VIRTUAL_TOURS.title,
      description: FEATURES.VIRTUAL_TOURS.description
    },
    {
      icon: <NavigationIcon className="w-8 h-8 text-blue-100" />,
      title: FEATURES.SMART_DIRECTIONS.title,
      description: FEATURES.SMART_DIRECTIONS.description
    }
  ];

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;