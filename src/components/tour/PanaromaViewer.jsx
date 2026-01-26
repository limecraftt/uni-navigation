import React, { useEffect, useRef, useState } from 'react';

const PanoramaViewer = ({ tour, onClose, isLoading }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isLoading && tour.panoramaUrl) {
      loadPanorama();
    }
  }, [isLoading, tour.panoramaUrl]);

  const loadPanorama = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imageRef.current = img;
      renderPanorama();
    };
    
    img.src = tour.panoramaUrl;
  };

  const renderPanorama = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply rotation and zoom transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    
    const offsetX = (rotation.yaw / 360) * img.width;
    const offsetY = (rotation.pitch / 180) * img.height;
    
    // Draw the panorama with wrapping
    ctx.drawImage(
      img,
      offsetX % img.width,
      Math.max(0, Math.min(img.height - canvas.height, offsetY)),
      canvas.width / zoom,
      canvas.height / zoom,
      -canvas.width / (2 * zoom),
      -canvas.height / (2 * zoom),
      canvas.width / zoom,
      canvas.height / zoom
    );
    
    ctx.restore();
  };

  useEffect(() => {
    renderPanorama();
  }, [rotation, zoom]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      yaw: (prev.yaw + deltaX * 0.5) % 360,
      pitch: Math.max(-90, Math.min(90, prev.pitch + deltaY * 0.5))
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - lastMousePos.x;
    const deltaY = e.touches[0].clientY - lastMousePos.y;

    setRotation(prev => ({
      yaw: (prev.yaw + deltaX * 0.5) % 360,
      pitch: Math.max(-90, Math.min(90, prev.pitch + deltaY * 0.5))
    }));

    setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setRotation({ yaw: 0, pitch: 0 });
    setZoom(1);
  };

  const handleNextHighlight = () => {
    setCurrentHighlight((prev) => (prev + 1) % tour.highlights.length);
  };

  const handlePrevHighlight = () => {
    setCurrentHighlight((prev) => (prev - 1 + tour.highlights.length) % tour.highlights.length);
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
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-1">{tour.title}</h2>
            <p className="text-gray-300">{tour.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-700 rounded-xl transition-colors ml-4 group"
            aria-label="Close viewer"
          >
            <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Panorama Canvas */}
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px] bg-gray-800">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-300 text-lg">Loading 360° experience...</p>
              </div>
            </div>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-[500px] cursor-grab active:cursor-grabbing bg-gray-900"
                style={{ touchAction: 'none' }}
              />
              
              {/* Controls Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                  className="p-3 bg-white/90 hover:bg-white rounded-xl shadow-lg transition-all backdrop-blur-sm group"
                  aria-label="Zoom in"
                >
                  <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
                <button
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                  className="p-3 bg-white/90 hover:bg-white rounded-xl shadow-lg transition-all backdrop-blur-sm group"
                  aria-label="Zoom out"
                >
                  <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                </button>
                <button
                  onClick={handleResetView}
                  className="p-3 bg-white/90 hover:bg-white rounded-xl shadow-lg transition-all backdrop-blur-sm group"
                  aria-label="Reset view"
                >
                  <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-3 bg-white/90 hover:bg-white rounded-xl shadow-lg transition-all backdrop-blur-sm group"
                  aria-label="Toggle fullscreen"
                >
                  <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
                <p className="text-sm">
                  <span className="font-semibold">Drag to rotate</span> • Scroll to zoom • Zoom: {(zoom * 100).toFixed(0)}%
                </p>
              </div>
            </>
          )}
        </div>
        
        {/* Footer Controls */}
        <div className="px-6 py-5 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-300">
              <span className="text-sm">Location Progress:</span>
              <span className="font-bold ml-2 text-white">
                {currentHighlight + 1} of {tour.highlights.length}
              </span>
              <span className="ml-3 text-blue-400 font-medium">
                {tour.highlights[currentHighlight]}
              </span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handlePrevHighlight}
                disabled={currentHighlight === 0}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl transition-colors font-semibold disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </div>
              </button>
              <button
                onClick={handleNextHighlight}
                disabled={currentHighlight === tour.highlights.length - 1}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl transition-colors font-semibold disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-2">
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Highlights Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tour.highlights.map((highlight, index) => (
              <button
                key={index}
                onClick={() => setCurrentHighlight(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  currentHighlight === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {highlight}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanoramaViewer;