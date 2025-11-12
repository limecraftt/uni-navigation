import React, { useState } from 'react';
import { CameraIcon } from '../assets/icons/svgIcons';
import ImageGallery from '../components/tour/ImageGallery';
import { ALL_LOCATIONS } from '../utils/constants';

const VirtualTour = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); // NEW: for image gallery
  const [isLoading, setIsLoading] = useState(false);

  // NEW: Get locations with images from your constants
  const locationsWithImages = ALL_LOCATIONS.filter(location => 
    location.images && location.images.length > 0
  );

  const tourLocations = [
    {
      id: 1,
      title: "Main Campus Entrance",
      description: "Explore the grand entrance and welcome center of the University of Embu",
      image: "/api/placeholder/400/250",
      duration: "3-5 min",
      highlights: ["Welcome Center", "Information Desk", "Campus Gardens"],
      available: true
    },
    {
      id: 2,
      title: "Academic Buildings",
      description: "Tour our state-of-the-art lecture halls, laboratories, and research facilities",
      image: "/api/placeholder/400/250",
      duration: "8-10 min",
      highlights: ["Modern Lecture Halls", "Research Labs", "Library Complex"],
      available: true
    },
    {
      id: 3,
      title: "Student Life Centers",
      description: "Discover recreational facilities, dining areas, and student activity centers",
      image: "/api/placeholder/400/250",
      duration: "6-8 min",
      highlights: ["Student Union", "Dining Hall", "Recreation Center"],
      available: true
    },
    {
      id: 4,
      title: "Residential Halls",
      description: "See our comfortable and modern student accommodation facilities",
      image: "/api/placeholder/400/250",
      duration: "5-7 min",
      highlights: ["Dormitories", "Common Areas", "Study Lounges"],
      available: false
    },
    {
      id: 5,
      title: "Sports & Recreation",
      description: "Experience our athletic facilities and outdoor recreational spaces",
      image: "/api/placeholder/400/250",
      duration: "7-9 min",
      highlights: ["Sports Complex", "Playing Fields", "Fitness Center"],
      available: false
    },
    {
      id: 6,
      title: "Campus Grounds",
      description: "Enjoy a scenic tour of our beautiful campus landscape and outdoor spaces",
      image: "/api/placeholder/400/250",
      duration: "10-12 min",
      highlights: ["Botanical Gardens", "Walking Paths", "Outdoor Amphitheater"],
      available: true
    }
  ];

  const handleStartTour = (tour) => {
    setSelectedTour(tour);
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleCloseTour = () => {
    setSelectedTour(null);
    setIsLoading(false);
  };

  // NEW: Handle location image gallery
  const handleViewLocationImages = (location) => {
    setSelectedLocation(location);
  };

  const handleCloseImageGallery = () => {
    setSelectedLocation(null);
  };

  // NEW: Location Card component for browsing individual locations
  const LocationCard = ({ location }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        {/* Use first image as card preview, or fallback placeholder */}
        <img 
          src={location.images && location.images.length > 0 
            ? location.images[0].src 
            : "/api/placeholder/400/250"
          } 
          alt={location.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
            {location.images ? location.images.length : 0} Photos
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {location.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{location.name}</h3>
        <p className="text-gray-600 mb-4">{location.description}</p>
        
        <div className="mb-4">
          <span className="text-sm text-gray-500">Walking time: {location.walkingTime}</span>
        </div>
        
        <button
          onClick={() => handleViewLocationImages(location)}
          className="w-full py-3 px-4 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <CameraIcon className="w-5 h-5" />
            <span>View Photos</span>
          </div>
        </button>
      </div>
    </div>
  );

  const TourCard = ({ tour }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            tour.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {tour.available ? 'Available' : 'Coming Soon'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {tour.duration}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
        <p className="text-gray-600 mb-4">{tour.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Tour Highlights:</h4>
          <div className="flex flex-wrap gap-2">
            {tour.highlights.map((highlight, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => handleStartTour(tour)}
          disabled={!tour.available}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            tour.available
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {tour.available ? (
            <div className="flex items-center justify-center space-x-2">
              <CameraIcon className="w-5 h-5" />
              <span>Start Virtual Tour</span>
            </div>
          ) : (
            'Coming Soon'
          )}
        </button>
      </div>
    </div>
  );

  const TourViewer = ({ tour }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{tour.title}</h2>
            <p className="text-gray-600">{tour.description}</p>
          </div>
          <button
            onClick={handleCloseTour}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading virtual tour...</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">360° Virtual Tour</h3>
                <p className="text-gray-600 mb-4">Interactive tour experience would load here</p>
                <div className="flex space-x-4 justify-center">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    🔄 Rotate View
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    🎯 Focus Mode
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    📱 VR Mode
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tour Progress: <span className="font-semibold">1 of {tour.highlights.length} locations</span>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                ⏮️ Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Next ⏭️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <CameraIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Virtual Campus Tours</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Explore the University of Embu campus from anywhere in the world with our immersive 360° virtual tours
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Interactive 360° Views
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              HD Quality Experience
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Mobile & VR Compatible
            </span>
          </div>
        </div>



        {/* NEW: Individual Location Photos Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse Location Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locationsWithImages.map(location => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
        
        {/* Original Tour Locations Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">360° Virtual Tours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourLocations.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>


      </div>

      {/* Tour Viewer Modal */}
      {selectedTour && <TourViewer tour={selectedTour} />}
      
      {/* NEW: Image Gallery Modal */}
      {selectedLocation && (
        <ImageGallery
          location={selectedLocation}
          onClose={handleCloseImageGallery}
        />
      )}
    </div>
  );
};

export default VirtualTour;