// src/components/hero/LocationCard.jsx
import React from 'react';
import Button from '../ui/Button';
import { DirectionsIcon, QRCodeIcon } from '../../assets/icons/svgIcons';

const LocationCard = ({ location, onClose, onGetDirections }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-lg mx-auto mb-8">
      <div className="text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left flex-1">
            <h4 className="font-bold text-lg">{location.name}</h4>
            {location.description && (
              <p className="text-sm text-white/80">{location.description}</p>
            )}
            <div className="flex items-center space-x-4 text-xs text-white/70 mt-2">
              <span>📍 {location.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white ml-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={onGetDirections}
          icon={<DirectionsIcon className="w-5 h-5" />}
          endIcon={<QRCodeIcon className="w-4 h-4" />}
          className="w-full"
        >
          Get Directions & QR Code
        </Button>

        <div className="mt-4 text-xs text-white/60 text-center">
          Get a QR code to scan with your phone for directions
        </div>
      </div>
    </div>
  );
};

export default LocationCard;