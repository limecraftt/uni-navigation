// src/components/sections/FeaturesSection.jsx
import React from 'react';
import FeatureCard from '../ui/FeatureCard';
import { MapIcon, CameraIcon, NavigationIcon } from '../../assets/icons/svgIcons';
import { FEATURES } from '../../utils/constants';

const FeaturesSection = () => {
  const features = [
    {
      icon: <MapIcon className="w-7 h-7" />,
      title: FEATURES.INTERACTIVE_MAPS.title,
      description: FEATURES.INTERACTIVE_MAPS.description
    },
    {
      icon: <CameraIcon className="w-7 h-7" />,
      title: FEATURES.VIRTUAL_TOURS.title,
      description: FEATURES.VIRTUAL_TOURS.description
    },
    {
      icon: <NavigationIcon className="w-7 h-7" />,
      title: FEATURES.SMART_DIRECTIONS.title,
      description: FEATURES.SMART_DIRECTIONS.description
    }
  ];

  return (
    <div>
      {/* Mobile: horizontal scrollable row */}
      <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {features.map((feature, index) => (
          <div key={index} className="snap-center flex-shrink-0 w-64">
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variant="light"
            />
          </div>
        ))}
      </div>

      {/* Desktop: 3 column grid */}
      <div className="hidden md:grid grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            variant="light"
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;