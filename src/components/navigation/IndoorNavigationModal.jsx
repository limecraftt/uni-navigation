import React, { useState } from 'react';
import {
  X, MapPin, Loader, AlertCircle,
  ChevronDown, Navigation
} from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import VideoPlayer from './VideoPlayer';

const IndoorNavigationModal = ({ isOpen, onClose, office }) => {
  const [startLocationId, setStartLocationId] = useState('');
  const [clips, setClips] = useState(null);
  const [searching, setSearching] = useState(false);
  const [noPath, setNoPath] = useState(false);

  const { findPath, getConnectedLocations, loading } = useNavigation();

  if (!isOpen || !office) return null;

  const connectedLocations = getConnectedLocations();

  const handleFindRoute = () => {
    if (!startLocationId) return;
    setSearching(true);
    setNoPath(false);

    // Match office name to a connected location
    const destination = connectedLocations.find(
      loc => loc.name.toLowerCase() === office.name.toLowerCase()
    );

    if (!destination) {
      setNoPath(true);
      setSearching(false);
      return;
    }

    const path = findPath(startLocationId, destination.id);

    if (!path || path.length === 0) {
      setNoPath(true);
    } else {
      setClips(path);
    }
    setSearching(false);
  };

  const handleReset = () => {
    setClips(null);
    setStartLocationId('');
    setNoPath(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-md shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-3xl md:rounded-t-2xl z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">
                {office.name}
              </h3>
              <p className="text-xs text-gray-500">Video Navigation</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">

          {/* ── Loading State ─────────────────────────────────── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">
                Loading navigation data...
              </p>
            </div>

          ) : clips ? (
            // ── Video Player ───────────────────────────────────
            <VideoPlayer
              clips={clips}
              onComplete={() => {}}
            />

          ) : (
            // ── Starting Point Selector ────────────────────────
            <div className="space-y-4">

              {/* Destination Badge */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Getting directions to</p>
                <p className="font-bold text-blue-700 text-base mt-0.5">
                  {office.name}
                </p>
                {office.category && (
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {office.category}
                  </p>
                )}
              </div>

              {/* Starting Point */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Where are you right now?
                </label>

                {connectedLocations.length === 0 ? (
                  // No clips uploaded yet
                  <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      No video navigation clips uploaded yet.
                      Ask the admin to add video routes first.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={startLocationId}
                      onChange={e => {
                        setStartLocationId(e.target.value);
                        setNoPath(false);
                      }}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Select your location --</option>
                      {connectedLocations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* No Path Found */}
              {noPath && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    No video route found between these locations yet.
                    Try a different starting point.
                  </p>
                </div>
              )}

              {/* How it works hint */}
              {connectedLocations.length > 0 && !noPath && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-2xl">
                  <span className="text-base">🎬</span>
                  <p className="text-xs text-gray-500">
                    Short video clips will guide you step by step
                    from your location to {office.name}.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFindRoute}
                  disabled={!startLocationId || searching || connectedLocations.length === 0}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-blue-700"
                >
                  {searching ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Finding...
                    </>
                  ) : (
                    <>
                      🎬 Start Navigation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Reset button when watching video */}
          {clips && (
            <button
              onClick={handleReset}
              className="w-full mt-4 py-2.5 text-sm text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
            >
              ← Choose different starting point
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default IndoorNavigationModal;