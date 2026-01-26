// src/components/sections/HeroSection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import LocationSearch from '../hero/LocationSearch';
import LocationCard from '../hero/LocationCard';
import QRModal from '../hero/QRModal';
import { 
  MapIcon, 
  ArrowRightIcon,
  CurrentLocationIcon
} from '../../assets/icons/svgIcons';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLocationSearch } from '../../hooks/useLocationSearch';

const HeroSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Custom hooks
  const { currentLocation, locationPermission } = useGeolocation();
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    handleCategorySelect,
    getLocationsToShow
  } = useLocationSearch();

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location.name);
    setIsDropdownOpen(false);
    setShowDirections(true);
  };

  const handleGetDirections = () => {
    if (!selectedLocation) return;
    setShowQRModal(true);
  };

  const handleCloseLocationCard = () => {
    setSelectedLocation(null);
    setShowDirections(false);
    setSearchQuery('');
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome to
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
            University of Embu
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Navigate our beautiful campus with interactive maps, virtual tours, and smart directions. 
            Discover every corner of your academic home.
          </p>
          
          {/* Location Status */}
          {currentLocation && (
            <div className="flex items-center justify-center space-x-2 text-sm text-white/80 mb-6">
              <CurrentLocationIcon className="w-4 h-4" />
              <span>
                {locationPermission === 'granted' 
                  ? 'Your location detected' 
                  : 'Using campus center as reference'}
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/directions">
              <Button 
                variant="primary" 
                size="large"
                icon={<MapIcon className="w-5 h-5" />}
                endIcon={<ArrowRightIcon className="w-4 h-4" />}
              >
                Offices and Departments
              </Button>
            </Link>
            
            {/* Location Search Component */}
            <LocationSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isDropdownOpen={isDropdownOpen}
              onDropdownToggle={setIsDropdownOpen}
              activeCategory={activeCategory}
              locations={getLocationsToShow()}
              onCategorySelect={handleCategorySelect}
              onLocationSelect={handleLocationSelect}
              currentLocation={currentLocation}
            />
            
            {/* Virtual Tour Button */}
            <Link to="/virtual-tour">
              <Button variant="secondary" size="large">
                Virtual Tour
              </Button>
            </Link>
          </div>

          {/* Selected Location Card */}
          {selectedLocation && showDirections && (
            <LocationCard
              location={selectedLocation}
              onClose={handleCloseLocationCard}
              onGetDirections={handleGetDirections}
              currentLocation={currentLocation}
            />
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default HeroSection;