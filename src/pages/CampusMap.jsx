import React, { useState } from 'react';
import { Map, Satellite } from 'lucide-react';

const CampusMap = () => {
  const [mapView, setMapView] = useState('satellite');

  // Google Maps embed URLs - University of Embu exact location
  const satelliteMapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d628.9!2d37.4576316!3d-0.5123788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2ske!4v1733673600000!5m2!1sen!2ske`;
  
  const standardMapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d628.9!2d37.4576316!3d-0.5123788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1733673600000!5m2!1sen!2ske`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">University of Embu</h1>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Campus Map</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our campus with satellite imagery
          </p>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Campus Map View</h3>
            
            {/* Map View Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMapView('satellite')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mapView === 'satellite'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Satellite className="w-4 h-4" />
                Satellite
              </button>
              <button
                onClick={() => setMapView('standard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mapView === 'standard'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                Standard
              </button>
            </div>
          </div>
          
          {/* Google Maps Embed */}
          <div className="rounded-xl overflow-hidden shadow-inner border-4 border-gray-100" style={{ height: '700px' }}>
            <iframe
              src={mapView === 'satellite' ? satelliteMapUrl : standardMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="University of Embu Campus Map"
            ></iframe>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>📍 University of Embu, P.O. Box 6, Embu 60100, Kenya | ☎️ (20) 244 4136</p>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;