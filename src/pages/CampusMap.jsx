import React, { useState, useEffect, useRef } from 'react';
import { MapPin, QrCode, Navigation, ExternalLink, Satellite, Map, Loader } from 'lucide-react';
import { getAllLocations } from '../api/locationsApi';

export default function CampusMap() {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [mapView, setMapView] = useState('satellite');
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [selectedMapsUrl, setSelectedMapsUrl] = useState('');

  useEffect(() => {
    getAllLocations().then(({ data }) => {
      setLocations(data || []);
      setLoadingLocations(false);
    });
  }, []);

  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) { initMap(); return; }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    };
    if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css'; css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
    }
    loadLeaflet();
    return () => { if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; } };
  }, []);

  const initMap = () => {
    if (leafletMapRef.current || !mapRef.current || !window.L) return;
    const L = window.L;
    const map = L.map(mapRef.current, { center: [-0.5126, 37.4580], zoom: 17 });
    leafletMapRef.current = map;
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri', maxZoom: 20 });
    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 20 });
    satellite.addTo(map);
    tileLayerRef.current = { satellite, street, active: 'satellite' };
  };

  useEffect(() => {
    if (!leafletMapRef.current || !tileLayerRef.current || !window.L) return;
    const map = leafletMapRef.current;
    const tiles = tileLayerRef.current;
    if (mapView === 'satellite' && tiles.active !== 'satellite') { map.removeLayer(tiles.street); tiles.satellite.addTo(map); tiles.active = 'satellite'; }
    else if (mapView === 'street' && tiles.active !== 'street') { map.removeLayer(tiles.satellite); tiles.street.addTo(map); tiles.active = 'street'; }
  }, [mapView]);

  const grouped = locations.reduce((acc, loc) => {
    if (!acc[loc.category]) acc[loc.category] = [];
    acc[loc.category].push(loc);
    return acc;
  }, {});

  const generateQRCode = () => {
    if (!selectedLocation) { alert('Please select a destination first!'); return; }
    const loc = locations.find(l => l.name === selectedLocation);
    if (loc) {
      setSelectedMapsUrl(loc.maps_url);
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(loc.maps_url)}`);
      setShowQR(true);
    }
  };

  const reset = () => { setShowQR(false); setQrCodeUrl(''); setSelectedMapsUrl(''); setSelectedLocation(''); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">University of Embu</h1>
          <h2 className="text-lg md:text-2xl font-semibold text-blue-600 mb-2">Campus Navigation System</h2>
          <p className="text-sm text-gray-600">Select your destination and get directions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Where do you want to go?</h3>
          </div>

          {!showQR ? (
            <div className="space-y-3">
              {loadingLocations ? (
                <div className="flex items-center gap-2 py-3 text-gray-500 text-sm"><Loader className="w-4 h-4 animate-spin" />Loading locations...</div>
              ) : (
                <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base">
                  <option value="">-- Choose a location --</option>
                  {Object.entries(grouped).map(([cat, locs]) => (
                    <optgroup key={cat} label={cat}>
                      {locs.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              )}
              <button onClick={generateQRCode} disabled={!selectedLocation || loadingLocations}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all ${selectedLocation ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>
                <QrCode className="w-5 h-5" />Generate QR Code
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <h4 className="text-lg font-bold text-gray-900">{selectedLocation}</h4>
                <p className="text-sm text-gray-600">Scan QR code or tap Open Directions</p>
              </div>
              <div className="bg-white border-4 border-gray-200 rounded-xl p-4 inline-block shadow-lg">
                <img src={qrCodeUrl} alt="QR Code" className="w-52 h-52 md:w-64 md:h-64 mx-auto" />
              </div>
              <a href={selectedMapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg w-full">
                <ExternalLink className="w-5 h-5" />Open Directions in Google Maps
              </a>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={reset} className="flex-1 px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm">Select Another Location</button>
                <a href={qrCodeUrl} download={`${selectedLocation}.png`} className="flex-1 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm text-center">Download QR Code</a>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Campus Map</h3>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setMapView('satellite')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mapView === 'satellite' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                <Satellite className="w-3.5 h-3.5" />Satellite
              </button>
              <button onClick={() => setMapView('street')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mapView === 'street' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                <Map className="w-3.5 h-3.5" />Street
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-gray-100" style={{ height: '70vh', minHeight: '400px' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">👆 One finger to pan · Pinch to zoom</p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>📍 University of Embu, P.O. Box 6, Embu 60100, Kenya</p>
        </div>
      </div>
    </div>
  );
}
