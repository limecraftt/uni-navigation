// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect } from 'react';

const PanoramaViewer = ({ tour, onClose }) => {
  const videoRef = useRef(null);
  const lastXRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onReady = () => {
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };
    video.addEventListener('loadedmetadata', onReady);
    video.addEventListener('canplaythrough', onReady);
    return () => {
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('canplaythrough', onReady);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady) return;

    const onTouchStart = (e) => {
      lastXRef.current = e.touches[0].clientX;
      setShowHint(false);
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      if (lastXRef.current === null || !video.duration) return;
      const deltaX = e.touches[0].clientX - lastXRef.current;
      lastXRef.current = e.touches[0].clientX;
      // Each pixel of drag = small fraction of video duration
      const timeDelta = -(deltaX / window.innerWidth) * video.duration * 1.5;
      const newTime = Math.max(0, Math.min(video.duration, video.currentTime + timeDelta));
      video.currentTime = newTime;
    };

    const onTouchEnd = () => {
      lastXRef.current = null;
    };

    video.addEventListener('touchstart', onTouchStart, { passive: true });
    video.addEventListener('touchmove', onTouchMove, { passive: false });
    video.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      video.removeEventListener('touchstart', onTouchStart);
      video.removeEventListener('touchmove', onTouchMove);
      video.removeEventListener('touchend', onTouchEnd);
    };
  }, [videoReady]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 flex-shrink-0">
        <div>
          <h2 className="text-white font-bold text-base">{tour.title}</h2>
          {tour.description && <p className="text-gray-400 text-xs">{tour.description}</p>}
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          src={tour.panoramaUrl}
          className="w-full h-full object-cover"
          playsInline
          muted
          preload="auto"
          style={{ touchAction: 'none' }}
        />

        {!videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-white text-sm">Loading tour...</p>
            </div>
          </div>
        )}

        {showHint && videoReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 rounded-2xl px-6 py-4 text-center">
              <div className="flex items-center justify-center space-x-3 mb-1">
                <span className="text-2xl">👈</span>
                <span className="text-white font-bold">Swipe to Look Around</span>
                <span className="text-2xl">👉</span>
              </div>
              <p className="text-gray-300 text-xs">Drag to explore the 360° view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanoramaViewer;