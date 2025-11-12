// src/components/hero/LocationList.jsx
import React from 'react';
import { LOCATION_CATEGORIES } from '../../utils/constants';

const LocationList = ({ 
  locations, 
  onLocationSelect, 
  currentLocation,
  searchQuery 
}) => {
  const getCategoryIcon = (categoryKey) => {
    const category = LOCATION_CATEGORIES.find(cat => cat.key === categoryKey);
    return category ? category.icon : '📍';
  };

  if (locations.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        <p>No locations found</p>
        <p className="text-sm mt-1">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto">
      {locations.map((location) => (
        <div
          key={location.id}
          onClick={() => onLocationSelect(location)}
          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <span className="text-lg">
                  {getCategoryIcon(location.category.toUpperCase().replace(/ & /g, '_').replace(/ /g, '_'))}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {location.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {location.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {location.popular && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationList;