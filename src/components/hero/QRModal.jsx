// src/components/hero/QRModal.jsx
import React from 'react';
import { DownloadIcon, ShareIcon } from '../../assets/icons/svgIcons';

const QRModal = ({ 
  isOpen,
  onClose,
  selectedLocation,
  qrCodeDataURL,
  navigationLinks,
  onDownload,
  onShare
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Simple Header with Back Button */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 rounded-t-2xl">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Scan for Directions
            </h3>
            <p className="text-gray-600 mb-6">
              Scan this QR code with your phone to get walking directions to {selectedLocation?.name}
            </p>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-100 mb-6 shadow-sm">
              <img 
                src={qrCodeDataURL} 
                alt="QR Code for directions"
                className="mx-auto w-48 h-48"
              />
            </div>

            {/* Navigation App Options */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-900">Or open directly:</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => window.open(navigationLinks?.googleMaps, '_blank')}
                  className="p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="text-2xl mb-1">📍</div>
                  <div className="text-xs font-medium">Google Maps</div>
                </button>
                <button
                  onClick={() => window.open(navigationLinks?.appleMaps, '_blank')}
                  className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="text-2xl mb-1">🍎</div>
                  <div className="text-xs font-medium">Apple Maps</div>
                </button>
                <button
                  onClick={() => window.open(navigationLinks?.waze, '_blank')}
                  className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="text-2xl mb-1">🚗</div>
                  <div className="text-xs font-medium">Waze</div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onDownload}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={onShare}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;