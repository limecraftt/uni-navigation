import React, { useState, useEffect } from 'react';
import { CameraIcon } from '../assets/icons/svgIcons';
import ImageGallery from '../components/tour/ImageGallery';
import PanoramaViewer from '../components/tour/PanoramaViewer';
import { getCampusImagesByLocation, getAllPanoramas } from '../api/imagesApi';

const VirtualTour = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  
  const [locationsWithImages, setLocationsWithImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [tourLocations, setTourLocations] = useState([]);
  const [loadingPanoramas, setLoadingPanoramas] = useState(true);

  useEffect(() => {
    fetchCampusImages();
    fetchPanoramas();
  }, []);

  const fetchCampusImages = async () => {
    setLoadingImages(true);
    try {
      const { data, error } = await getCampusImagesByLocation();
      if (error) throw error;
      if (data) setLocationsWithImages(data);
    } catch (error) {
      console.error('Error fetching campus images:', error);
    }
    setLoadingImages(false);
  };

  const fetchPanoramas = async () => {
    setLoadingPanoramas(true);
    try {
      const { data, error } = await getAllPanoramas();
      if (error) throw error;
      if (data) {
        const transformedPanoramas = data.map(panorama => ({
          id: panorama.id,
          title: panorama.title,
          description: panorama.description,
          image: panorama.thumbnail_url || panorama.panorama_url,
          panoramaUrl: panorama.panorama_url,
          duration: panorama.duration,
          highlights: panorama.highlights || [],
          available: panorama.is_available
        }));
        setTourLocations(transformedPanoramas);
      }
    } catch (error) {
      console.error('Error fetching panoramas:', error);
    }
    setLoadingPanoramas(false);
  };

  const handleStartTour = (tour) => {
    setSelectedTour(tour);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleCloseTour = () => {
    setSelectedTour(null);
    setIsLoading(false);
  };

  const handleViewLocationImages = (location) => setSelectedLocation(location);
  const handleCloseImageGallery = () => setSelectedLocation(null);

  const LocationCard = ({ location }) => (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={location.images && location.images.length > 0
            ? location.images[0].src
            : "/api/placeholder/400/300"}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 text-blue-600 px-2 py-1 rounded-full text-xs font-bold shadow">
            {location.images ? location.images.length : 0} Photos
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold shadow capitalize">
            {location.category}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{location.name}</h3>
        {location.walkingTime && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {location.walkingTime}
          </div>
        )}
        <button
          onClick={() => handleViewLocationImages(location)}
          className="w-full py-2.5 px-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center space-x-2"
        >
          <CameraIcon className="w-4 h-4" />
          <span>View Photos</span>
        </button>
      </div>
    </div>
  );

  const TourCard = ({ tour }) => (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={tour.image || "/api/placeholder/400/250"}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold shadow ${
            tour.available ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
          }`}>
            {tour.available ? '✓ Available' : '⏳ Soon'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {tour.duration && (
            <span className="bg-white/95 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold shadow">
              {tour.duration}
            </span>
          )}
          <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
            360°
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{tour.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{tour.description}</p>

        {tour.highlights && tour.highlights.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tour.highlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                {highlight}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => handleStartTour(tour)}
          disabled={!tour.available}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
            tour.available
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {tour.available ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start 360° Tour</span>
            </>
          ) : (
            <span>Coming Soon</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <CameraIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Virtual Campus Experience
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore the University of Embu campus through stunning 360° tours and high-quality photography
          </p>

          {/* Badges — hidden on mobile to save space */}
          <div className="hidden md:flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-semibold text-gray-700">Interactive 360° Views</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-semibold text-gray-700">HD Quality</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              <span className="font-semibold text-gray-700">Mobile & VR Ready</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-md w-full max-w-xs md:max-w-none md:w-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 md:flex-none px-5 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                activeTab === 'browse'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Browse Photos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('360')}
              className={`flex-1 md:flex-none px-5 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                activeTab === '360'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>360° Tours</span>
              </div>
            </button>
          </div>
        </div>

        {/* Browse Photos Tab */}
        {activeTab === 'browse' && (
          <div>
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Location Gallery</h2>
              <p className="text-gray-500 text-sm md:text-base">Browse through our collection of campus locations</p>
            </div>

            {loadingImages ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">Loading images...</p>
              </div>
            ) : locationsWithImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {locationsWithImages.map((location, index) => (
                  <LocationCard key={index} location={location} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Images Yet</h3>
                <p className="text-gray-500 text-sm">Upload images from the admin panel to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* 360 Tours Tab */}
        {activeTab === '360' && (
          <div>
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Immersive 360° Tours</h2>
              <p className="text-gray-500 text-sm md:text-base">Experience the campus in full panoramic view</p>
            </div>

            {loadingPanoramas ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">Loading 360° tours...</p>
              </div>
            ) : tourLocations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {tourLocations.map(tour => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No 360° Tours Yet</h3>
                <p className="text-gray-500 text-sm">Upload panoramas from the admin panel to get started.</p>
              </div>
            )}
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