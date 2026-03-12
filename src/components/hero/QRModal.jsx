// src/components/hero/QRModal.jsx
import React from 'react';
import { ExternalLink, Download, X } from 'lucide-react';

const QRModal = ({ isOpen, onClose, selectedLocation }) => {
  if (!isOpen || !selectedLocation) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedLocation.maps_url)}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-gray-900">Get Directions</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          {/* Location name */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="font-bold text-gray-900 text-lg">{selectedLocation.name}</p>
            {selectedLocation.description && (
              <p className="text-sm text-gray-500 mt-0.5">{selectedLocation.description}</p>
            )}
            <p className="text-xs text-blue-600 mt-1">📍 {selectedLocation.category}</p>
          </div>

          {/* QR Code */}
          <div className="bg-white border-4 border-gray-100 rounded-xl p-3 inline-block shadow-md">
            <img
              src={qrCodeUrl}
              alt={`QR code for ${selectedLocation.name}`}
              className="w-52 h-52 mx-auto"
            />
          </div>
          <p className="text-xs text-gray-400">Scan with your phone camera to open in Google Maps</p>

          {/* Open in Maps button */}
          <a  // ✅ attributes moved inside the opening tag
            href={selectedLocation.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </a>

          {/* Download QR */}
          <a  // ✅ changed <div> to <a>, attributes moved inside the opening tag
            href={qrCodeUrl}
            download={`${selectedLocation.name}-directions.png`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </a>
        </div>

      </div>
    </div>
  );
};

export default QRModal;