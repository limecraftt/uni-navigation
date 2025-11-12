// src/components/tour/ImageGallery.jsx
import React, { useState } from 'react';

const ImageGallery = ({ location, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // If location has no images, show message
  if (!location.images || location.images.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
          <h3 className="text-xl font-bold mb-4">{location.name}</h3>
          <p className="text-gray-600 mb-4">No images available for this location yet.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentImage = location.images[currentImageIndex];
  const totalImages = location.images.length;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        
        {/* Header with location name and close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
            <p className="text-sm text-gray-600">
              Image {currentImageIndex + 1} of {totalImages}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image display area */}
        <div className="relative">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="w-full h-96 object-cover"
          />
          
          {/* Previous button - only show if more than 1 image */}
          {totalImages > 1 && (
            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button - only show if more than 1 image */}
          {totalImages > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Image description */}
        {currentImage.description && (
          <div className="p-4 bg-gray-50">
            <p className="text-gray-700">{currentImage.description}</p>
          </div>
        )}

        {/* Navigation dots - only show if more than 1 image */}
        {totalImages > 1 && (
          <div className="flex justify-center space-x-2 py-4">
            {location.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ImageGallery;