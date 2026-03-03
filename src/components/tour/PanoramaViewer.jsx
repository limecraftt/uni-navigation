// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';

const FRAME_COUNT = 10;

// Generate thumbnail URLs from Cloudinary video URL
const getCloudinaryThumbnails = (videoUrl, count) => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/CLOUD/video/upload/VERSION/PUBLIC_ID.ext
    const match = videoUrl.match(/\/video\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!match) return null;
    
    const publicId = match[1];
    const cloudName = videoUrl.match(/res\.cloudinary\.com\/([^/]+)/)?.[1];
    if (!cloudName) return null;

    return Array.from({ length: count }, (_, i) => {
      const offset = Math.round((i / (count - 1)) * 100);
      return `https://res.cloudinary.com/${cloudName}/video/upload/so_${offset}p,w_120,h_80,c_fill,q_auto/${publicId}.jpg`;
    });
  } catch {
    return null;
  }
};

const PanoramaViewer = ({ tour, onClose, isLoading }) => {
  const videoRef = useRef(null);
  const filmstripRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const lastX = useRef(null);

  const thumbnails = tour.panoramaUrl ? getCloudinaryThumbnails(tour.panoramaUrl, FRAME_COUNT) : null;

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.crossOrigin = 'anonymous';

    const onMeta = () => {
      setDuration(video.duration);
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };

    const onCanPlay = () => {
      video.pause();
      if (!videoReady) {
        setDuration(video.duration);
        setVideoReady(true);
      }
    };

    const preventPlay = () => { video.pause(); };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('play', preventPlay);

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('play', preventPlay);
    };
  }, [tour.panoramaUrl]);

  const scrubVideo = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(duration || 0, time));
    video.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Swipe on video
  const handleVideoTouchStart = (e) => {
    lastX.current = e.touches[0].clientX;
    setIsDragging(true);
    setShowHint(false);
  };

  const handleVideoTouchMove = (e) => {
    e.preventDefault();
    if (lastX.current === null || !duration) return;
    const deltaX = e.touches[0].clientX - lastX.current;
    lastX.current = e.touches[0].clientX;
    const timeDelta = -(deltaX / window.innerWidth) * duration * 1.5;
    scrubVideo(currentTime + timeDelta);
  };

  const handleVideoTouchEnd = () => {
    lastX.current = null;
    setIsDragging(false);
  };

  // Filmstrip drag
  const scrubFromX = useCallback((clientX) => {
    const strip = filmstripRef.current;
    if (!strip || !duration) return;
    const rect = strip.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    scrubVideo(ratio * duration);
  }, [duration, scrubVideo]);

  const handleStripMouseDown = (e) => { setIsDragging(true); scrubFromX(e.clientX); };
  const handleMouseMove = useCallback((e) => { if (isDragging) scrubFromX(e.clientX); }, [isDragging, scrubFromX]);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleStripTouchStart = (e) => { scrubFromX(e.touches[0].clientX); };
  const handleStripTouchMove = (e) => { e.preventDefault(); scrubFromX(e.touches[0].clientX); };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (t) => {
    const s = Math.floor(t || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 z-10 flex-shrink-0">
        <div className="min-w-0">
          <h2 className="text-white font-bold text-base truncate">{tour.title}</h2>
          {tour.description && <p className="text-gray-400 text-xs truncate">{tour.description}</p>}
        </div>
        <button onClick={onClose} className="ml-3 flex-shrink-0 p-2 bg-white/10 hover:bg-white/20 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          src={tour.panoramaUrl}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          playsInline
          muted
          preload="auto"
          onTouchStart={handleVideoTouchStart}
          onTouchMove={handleVideoTouchMove}
          onTouchEnd={handleVideoTouchEnd}
          style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
        />

        {/* Loading overlay */}
        {!videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Drag hint */}
        {showHint && videoReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <div className="flex items-center justify-center space-x-3 mb-1">
                <span className="text-2xl">👈</span>
                <span className="text-white font-bold text-base">Drag to Explore</span>
                <span className="text-2xl">👉</span>
              </div>
              <p className="text-gray-300 text-xs">Swipe on video or drag the filmstrip below</p>
            </div>
          </div>
        )}
      </div>

      {/* Filmstrip Scrubber */}
      <div className="bg-black flex-shrink-0 pt-2 pb-6">
        {/* Time display */}
        <div className="flex justify-between text-xs px-4 mb-2">
          <span className="text-white font-medium">{formatTime(currentTime)}</span>
          <span className="text-gray-500">{formatTime(duration)}</span>
        </div>

        {/* Filmstrip */}
        <div
          ref={filmstripRef}
          className="relative overflow-hidden"
          style={{ height: '70px', touchAction: 'none', cursor: 'col-resize' }}
          onMouseDown={handleStripMouseDown}
          onTouchStart={handleStripTouchStart}
          onTouchMove={handleStripTouchMove}
        >
          {/* Frames */}
          <div className="flex w-full h-full">
            {thumbnails ? (
              thumbnails.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="flex-1 h-full object-cover border-r border-black"
                  style={{ minWidth: 0 }}
                  draggable={false}
                  onError={(e) => { e.target.style.background = '#1f2937'; }}
                />
              ))
            ) : (
              Array.from({ length: FRAME_COUNT }).map((_, i) => (
                <div key={i} className="flex-1 h-full bg-gray-800 border-r border-black" />
              ))
            )}
          </div>

          {/* White position line */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: `${progress}%`,
              width: '2px',
              background: 'white',
              boxShadow: '0 0 8px rgba(255,255,255,0.9)',
              transform: 'translateX(-1px)',
            }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2"
              style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid white' }} />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2"
              style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '6px solid white' }} />
          </div>

          {/* Dimmed overlay for unvisited portion */}
          <div
            className="absolute top-0 right-0 bottom-0 bg-black/30 pointer-events-none"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Highlights */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="flex gap-2 mt-3 px-4 overflow-x-auto scrollbar-hide">
            {tour.highlights.map((h, i) => (
              <span key={i} className="flex-shrink-0 px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanoramaViewer;