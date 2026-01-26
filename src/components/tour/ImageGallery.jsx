import React, { useState, useEffect } from 'react';

const ImageGallery = ({ location, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const images = location.images || [];
  const currentImage = images[currentImageIndex];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentImageIndex]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageIndex]);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-98 z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <div className="flex-1">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-1">
            {location.name}
          </h2>
          <p className="text-sm md:text-base text-gray-300">
            {location.category} • {location.walkingTime}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 md:p-3 hover:bg-white/10 rounded-xl transition-colors ml-4 group"
          aria-label="Close gallery"
        >
          <svg 
            className="w-6 h-6 md:w-7 md:h-7 text-gray-300 group-hover:text-white transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        {/* Navigation Buttons - Desktop */}
        <button
          onClick={handlePrev}
          disabled={images.length <= 1}
          className="hidden md:flex absolute left-4 lg:left-8 z-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          aria-label="Previous image"
        >
          <svg 
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Image with Loading State */}
        <div 
          className="relative max-w-6xl max-h-full flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
            </div>
          )}
          
          <img
            src={currentImage?.src}
            alt={currentImage?.caption || location.name}
            className={`max-w-full max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-200px)] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Image Caption */}
          {currentImage?.caption && imageLoaded && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <p className="text-white text-sm md:text-base text-center">
                {currentImage.caption}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={images.length <= 1}
          className="hidden md:flex absolute right-4 lg:right-8 z-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          aria-label="Next image"
        >
          <svg 
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Mobile Navigation Indicators */}
        <div className="md:hidden absolute top-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer with Controls and Thumbnails */}
      <div className="bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 space-y-4">
        {/* Controls Bar */}
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Image Counter */}
          <div className="text-white text-sm md:text-base font-medium">
            <span className="text-blue-400 font-bold">{currentImageIndex + 1}</span>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-300">{images.length}</span>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 md:gap-3">
            {/* Mobile Navigation */}
            <button
              onClick={handlePrev}
              disabled={images.length <= 1}
              className="md:hidden p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all disabled:opacity-30"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={images.length <= 1}
              className="md:hidden p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all disabled:opacity-30"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all"
              aria-label="Toggle fullscreen"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>

            {/* Download Button */}
            <a
              href={currentImage?.src}
              download
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all"
              aria-label="Download image"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-4 ring-blue-500 scale-105'
                      : 'ring-2 ring-white/20 hover:ring-white/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover"
                  />
                  {index === currentImageIndex && (
                    <div className="absolute inset-0 bg-blue-500/20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Swipe Hint for Mobile */}
        <div className="md:hidden text-center">
          <p className="text-gray-400 text-xs">
            👈 Swipe to navigate 👉
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;