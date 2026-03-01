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
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Welcome to
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-blue-400 mb-4 md:mb-6">
            University of Embu
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Navigate our beautiful campus with interactive maps, virtual tours, and smart directions. 
            Discover every corner of your academic home.
          </p>
          
          {/* Location Status */}
          {currentLocation && (
            <div className="flex items-center justify-center space-x-2 text-sm text-white/80 mb-4 md:mb-6">
              <CurrentLocationIcon className="w-4 h-4" />
              <span>
                {locationPermission === 'granted' 
                  ? 'Your location detected' 
                  : 'Using campus center as reference'}
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 justify-center items-center mb-10 md:mb-16 w-full max-w-sm mx-auto md:max-w-none md:flex-row md:gap-4">
            <Link to="/directions" className="w-full md:w-auto">
              <Button 
                variant="primary" 
                size="large"
                icon={<MapIcon className="w-5 h-5" />}
                endIcon={<ArrowRightIcon className="w-4 h-4" />}
                className="w-full"
              >
                Offices and Departments
              </Button>
            </Link>
            
            {/* Location Search Component */}
            <div className="w-full md:w-auto">
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
            </div>
            
            {/* Virtual Tour Button */}
            <Link to="/virtual-tour" className="w-full md:w-auto">
              <Button variant="secondary" size="large" className="w-full">
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