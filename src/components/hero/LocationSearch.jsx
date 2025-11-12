// src/components/hero/LocationSearch.jsx
import React, { useRef, useEffect } from 'react';
import LocationDropdown from './LocationDropdown';

const LocationSearch = ({
  searchQuery,
  onSearchChange,
  isDropdownOpen,
  onDropdownToggle,
  activeCategory,
  locations,
  onCategorySelect,
  onLocationSelect,
  currentLocation
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onDropdownToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onDropdownToggle]);

  const handleInputFocus = () => {
    onDropdownToggle(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3 hover:bg-white/15 transition-colors">
        <input 
          type="text" 
          placeholder="Where do you want to go?" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleInputFocus}
          className="bg-transparent text-white placeholder-white/70 outline-none text-lg w-64"
        />
      </div>

      <LocationDropdown 
        isOpen={isDropdownOpen}
        activeCategory={activeCategory}
        locations={locations}
        onCategorySelect={onCategorySelect}
        onLocationSelect={onLocationSelect}
        currentLocation={currentLocation}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default LocationSearch;