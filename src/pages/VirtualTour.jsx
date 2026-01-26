import React, { useState, useEffect } from 'react';
import { CameraIcon } from '../assets/icons/svgIcons';
import ImageGallery from '../components/tour/ImageGallery';
import PanoramaViewer from '../components/tour/PanoramaViewer';
import { ALL_LOCATIONS } from '../utils/constants';
import { supabase } from '../config/supabaseClient';

const VirtualTour = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or '360'
  
  // Supabase integration
  const [tourData, setTourData] = useState([]);
  const [locationPhotos, setLocationPhotos] = useState([]);

  useEffect(() => {
    fetchTourData();
    fetchLocationPhotos();
  }, []);

  const fetchTourData = async () => {
    try {
      const { data, error } = await supabase
        .from('virtual_tours')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      if (data) setTourData(data);
    } catch (error) {
      console.error('Error fetching tour data:', error);
    }
  };

  const fetchLocationPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('location_photos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setLocationPhotos(data);
    } catch (error) {
      console.error('Error fetching location photos:', error);
    }
  };

  const locationsWithImages = ALL_LOCATIONS.filter(location => 
    location.images && location.images.length > 0
  );

  const tourLocations = [
    {
      id: 1,
      title: "Main Campus Entrance",
      description: "Explore the grand entrance and welcome center of the University of Embu",
      image: "/api/placeholder/400/250",
      panoramaUrl: "https://your-supabase-bucket.supabase.co/storage/v1/object/public/360-images/entrance.jpg",
      duration: "3-5 min",
      highlights: ["Welcome Center", "Information Desk", "Campus Gardens"],
      available: true
    },
    {
      id: 2,
      title: "Academic Buildings",
      description: "Tour our state-of-the-art lecture halls, laboratories, and research facilities",
      image: "/api/placeholder/400/250",
      panoramaUrl: "https://your-supabase-bucket.supabase.co/storage/v1/object/public/360-images/academic.jpg",
      duration: "8-10 min",
      highlights: ["Modern Lecture Halls", "Research Labs", "Library Complex"],
      available: true
    },
    {
      id: 3,
      title: "Student Life Centers",
      description: "Discover recreational facilities, dining areas, and student activity centers",
      image: "/api/placeholder/400/250",
      panoramaUrl: "https://your-supabase-bucket.supabase.co/storage/v1/object/public/360-images/student-life.jpg",
      duration: "6-8 min",
      highlights: ["Student Union", "Dining Hall", "Recreation Center"],
      available: true
    },
    {
      id: 4,
      title: "Residential Halls",
      description: "See our comfortable and modern student accommodation facilities",
      image: "/api/placeholder/400/250",
      panoramaUrl: null,
      duration: "5-7 min",
      highlights: ["Dormitories", "Common Areas", "Study Lounges"],
      available: false
    },
    {
      id: 5,
      title: "Sports & Recreation",
      description: "Experience our athletic facilities and outdoor recreational spaces",
      image: "/api/placeholder/400/250",
      panoramaUrl: null,
      duration: "7-9 min",
      highlights: ["Sports Complex", "Playing Fields", "Fitness Center"],
      available: false
    },
    {
      id: 6,
      title: "Campus Grounds",
      description: "Enjoy a scenic tour of our beautiful campus landscape and outdoor spaces",
      image: "/api/placeholder/400/250",
      panoramaUrl: "https://your-supabase-bucket.supabase.co/storage/v1/object/public/360-images/grounds.jpg",
      duration: "10-12 min",
      highlights: ["Botanical Gardens", "Walking Paths", "Outdoor Amphitheater"],
      available: true
    }
  ];

  const handleStartTour = (tour) => {
    setSelectedTour(tour);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleCloseTour = () => {
    setSelectedTour(null);
    setIsLoading(false);
  };

  const handleViewLocationImages = (location) => {
    setSelectedLocation(location);
  };

  const handleCloseImageGallery = () => {
    setSelectedLocation(null);
  };

  const LocationCard = ({ location }) => (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={location.images && location.images.length > 0 
            ? location.images[0].src 
            : "/api/placeholder/400/300"
          } 
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="bg-white/95 backdrop-blur-sm text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-1.5"></span>
            {location.images ? location.images.length : 0} Photos
          </span>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            {location.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {location.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{location.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {location.walkingTime}
        </div>
        
        <button
          onClick={() => handleViewLocationImages(location)}
          className="w-full py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 shadow-md hover:shadow-xl"
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
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
            tour.available 
              ? 'bg-green-500/95 text-white' 
              : 'bg-yellow-500/95 text-white'
          }`}>
            {tour.available ? '✓ Available' : '⏳ Coming Soon'}
          </span>
        </div>
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tour.duration}
          </span>
          <span className="bg-purple-500/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            360°
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {tour.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
        
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tour Highlights
          </h4>
          <div className="flex flex-wrap gap-2">
            {tour.highlights.map((highlight, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => handleStartTour(tour)}
          disabled={!tour.available}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md ${
            tour.available
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {tour.available ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start 360° Tour</span>
            </div>
          ) : (
            <span>Coming Soon</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <CameraIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Virtual Campus Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Immerse yourself in the University of Embu campus through stunning 360° tours and high-quality photography
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-semibold text-gray-700">Interactive 360° Views</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-semibold text-gray-700">HD Quality Experience</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-semibold text-gray-700">Mobile & VR Ready</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-lg">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Browse Photos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('360')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === '360'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>360° Tours</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'browse' && (
          <div className="mb-16 animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Location Gallery</h2>
              <p className="text-gray-600">Browse through our collection of campus locations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locationsWithImages.map(location => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          </div>
        )}

        {activeTab === '360' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Immersive 360° Tours</h2>
              <p className="text-gray-600">Experience the campus in full panoramic view</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tourLocations.map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tour Viewer Modal */}
      {selectedTour && (
        <PanoramaViewer 
          tour={selectedTour} 
          onClose={handleCloseTour}
          isLoading={isLoading}
        />
      )}
      
      {/* Image Gallery Modal */}
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