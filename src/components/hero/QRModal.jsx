// src/components/hero/QRModal.jsx
import React from 'react';

const QRModal = ({ 
  isOpen,
  onClose,
  selectedLocation
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
              Navigation Info
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedLocation?.name}
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                For detailed navigation with QR codes, please visit the <strong>Offices and Departments</strong> page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;