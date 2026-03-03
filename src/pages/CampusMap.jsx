import React, { useState } from 'react';
import { Map, Satellite, MapPin, QrCode, Navigation, ExternalLink } from 'lucide-react';

const CampusMap = () => {
  const [mapView, setMapView] = useState('satellite');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [directionsUrl, setDirectionsUrl] = useState('');

  const campusLocations = [
    { name: 'Main Gate', lat: -0.5123788, lng: 37.4576316, category: 'Entrance' },
    { name: 'Administration Block', lat: -0.5125, lng: 37.4578, category: 'Administrative' },
    { name: 'Library', lat: -0.5127, lng: 37.4580, category: 'Academic' },
    { name: 'Student Center', lat: -0.5124, lng: 37.4582, category: 'Student Services' },
    { name: 'ICT Building', lat: -0.5126, lng: 37.4579, category: 'Academic' },
    { name: 'Science Laboratory Block', lat: -0.5128, lng: 37.4581, category: 'Academic' },
    { name: 'Lecture Hall 1', lat: -0.5125, lng: 37.4577, category: 'Academic' },
    { name: 'Lecture Hall 2', lat: -0.5126, lng: 37.4578, category: 'Academic' },
    { name: 'Cafeteria', lat: -0.5123, lng: 37.4583, category: 'Dining' },
    { name: 'Sports Complex', lat: -0.5130, lng: 37.4585, category: 'Recreation' },
    { name: 'Health Center', lat: -0.5122, lng: 37.4575, category: 'Health Services' },
    { name: 'Hostel A (Male)', lat: -0.5129, lng: 37.4586, category: 'Accommodation' },
    { name: 'Hostel B (Female)', lat: -0.5130, lng: 37.4587, category: 'Accommodation' },
    { name: 'Parking Lot', lat: -0.5122, lng: 37.4576, category: 'Parking' },
    { name: 'Engineering Workshop', lat: -0.5127, lng: 37.4584, category: 'Academic' },
    { name: 'Chapel', lat: -0.5124, lng: 37.4574, category: 'Religious' },
    { name: 'Auditorium', lat: -0.5126, lng: 37.4580, category: 'Events' },
    { name: 'Research Center', lat: -0.5128, lng: 37.4582, category: 'Research' },
    { name: 'Computer Labs', lat: -0.5125, lng: 37.4581, category: 'Academic' },
    { name: 'Faculty of Education', lat: -0.5127, lng: 37.4579, category: 'Academic' }
  ];

  const groupedLocations = campusLocations.reduce((acc, location) => {
    if (!acc[location.category]) acc[location.category] = [];
    acc[location.category].push(location);
    return acc;
  }, {});

  // &gestureHandling=greedy allows single finger pan on mobile
  const satelliteMapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d628.9!2d37.4576316!3d-0.5123788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2ske!4v1733673600000!5m2!1sen!2ske&gestureHandling=greedy`;
  const standardMapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d628.9!2d37.4576316!3d-0.5123788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1733673600000!5m2!1sen!2ske&gestureHandling=greedy`;

  const generateQRCode = () => {
    if (!selectedLocation) { alert('Please select a destination first!'); return; }
    const location = campusLocations.find(loc => loc.name === selectedLocation);
    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrApi);
      setDirectionsUrl(url);
      setShowQR(true);
    }
  };

  const resetQR = () => {
    setShowQR(false);
    setQrCodeUrl('');
    setDirectionsUrl('');
    setSelectedLocation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">University of Embu</h1>
          <h2 className="text-lg md:text-2xl font-semibold text-blue-600 mb-2">Campus Navigation System</h2>
          <p className="text-sm text-gray-600">Select your destination and get QR code directions</p>
        </div>

        {/* Navigation Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <h3 className="text-lg font-bold text-gray-900">Where do you want to go?</h3>
          </div>

          {!showQR ? (
            <div className="space-y-3">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              >
                <option value="">-- Choose a location --</option>
                {Object.entries(groupedLocations).map(([category, locations]) => (
                  <optgroup key={category} label={category}>
                    {locations.map((loc) => (
                      <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <button
                onClick={generateQRCode}
                disabled={!selectedLocation}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-base transition-all ${
                  selectedLocation ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <QrCode className="w-5 h-5" />
                Generate QR Code
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <h4 className="text-lg font-bold text-gray-900">{selectedLocation}</h4>
                <p className="text-sm text-gray-600">Scan the QR code to get directions</p>
              </div>

              <div className="bg-white border-4 border-gray-200 rounded-xl p-4 inline-block shadow-lg">
                <img src={qrCodeUrl} alt="QR Code" className="w-52 h-52 md:w-72 md:h-72 mx-auto" />
              </div>

              <a href={directionsUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg w-full">
                <ExternalLink className="w-5 h-5" />
                Open Directions
              </a>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button onClick={resetQR}
                  className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm">
                  Select Another Location
                </button>
                <a href={qrCodeUrl} download={`${selectedLocation}-directions.png`}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm text-center">
                  Download QR Code
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Campus Map</h3>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setMapView('satellite')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mapView === 'satellite' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                <Satellite className="w-3.5 h-3.5" />
                Satellite
              </button>
              <button onClick={() => setMapView('standard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mapView === 'standard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                <Map className="w-3.5 h-3.5" />
                Standard
              </button>
            </div>
          </div>

          {/* Map — tall on mobile, taller on desktop */}
          <div className="rounded-xl overflow-hidden border-2 border-gray-100"
            style={{ height: '70vh', minHeight: '400px', maxHeight: '700px' }}>
            <iframe
              src={mapView === 'satellite' ? satelliteMapUrl : standardMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="University of Embu Campus Map"
            />
          </div>

          <p className="text-xs text-gray-400 text-center mt-2">
            Use one finger to pan the map
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>📍 University of Embu, P.O. Box 6, Embu 60100, Kenya</p>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;