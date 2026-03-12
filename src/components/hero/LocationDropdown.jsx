// src/components/hero/LocationDropdown.jsx
import React from 'react';
import CategoryTabs from './CategoryTabs';
import LocationList from './LocationList';

const LocationDropdown = ({
  isOpen,
  activeCategory,
  locations,
  categories,
  onCategorySelect,
  onLocationSelect,
  currentLocation,
  searchQuery
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
      <CategoryTabs
        activeCategory={activeCategory}
        onCategorySelect={onCategorySelect}
        categories={categories}
      />

      <LocationList
        locations={locations}
        onLocationSelect={onLocationSelect}
        currentLocation={currentLocation}
        searchQuery={searchQuery}
      />

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between text-xs text-gray-600">
          <span>💡 Tip: Click on categories to browse locations</span>
          <span>{locations.length} locations</span>
        </div>
      </div>
    </div>
  );
};

export default LocationDropdown;