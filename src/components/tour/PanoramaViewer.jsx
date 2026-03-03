// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect } from 'react';

const PanoramaViewer = ({ tour, onClose, isLoading }) => {
  const videoRef = useRef(null);
  const lastXRef = useRef(null);
  const rafRef = useRef(null);
  const targetRateRef = useRef(0);

  const [videoReady, setVideoReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Smooth playback rate animation loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loop = () => {
      if (video) {
        // Smoothly interpolate current playback rate toward target
        const current = video.playbackRate * (targetRateRef.current >= 0 ? 1 : -1);
        const target = targetRateRef.current;

        if (Math.abs(target) < 0.05) {
          // Stop
          video.pause();
          video.playbackRate = 1;
        } else if (target > 0) {
          // Forward
          if (video.paused) video.play();
          video.playbackRate = Math.min(Math.abs(target), 8);
        } else {
          // Backward — small seek steps
          video.pause();
          const step = Math.min(Math.abs(target) * 0.04, 0.3);
          video.currentTime = Math.max(0, video.currentTime - step);
        }

        // Wrap around
        if (video.currentTime >= video.duration - 0.05) {
          video.currentTime = 0;
        }

        setCurrentTime(video.currentTime || 0);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      setDuration(video.duration || 0);
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };

    video.addEventListener('loadedmetadata', onReady);
    video.addEventListener('canplay', () => {
      if (!videoReady) onReady();
    });

    return () => {
      video.removeEventListener('loadedmetadata', onReady);
    };
  }, []);

  // Touch handlers
  const handleTouchStart = (e) => {
    lastXRef.current = e.touches[0].clientX;
    targetRateRef.current = 0;
    setShowHint(false);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (lastXRef.current === null) return;

    const deltaX = e.touches[0].clientX - lastXRef.current;
    lastXRef.current = e.touches[0].clientX;

    // Map finger speed to playback rate
    // Right = backward, Left = forward (natural panning feel)
    const rate = -(deltaX / 6);
    targetRateRef.current = rate;
  };

  const handleTouchEnd = () => {
    lastXRef.current = null;
    // Gradually slow down
    const slowDown = () => {
      targetRateRef.current *= 0.85;
      if (Math.abs(targetRateRef.current) > 0.1) {
        requestAnimationFrame(slowDown);
      } else {
        targetRateRef.current = 0;
      }
    };
    requestAnimationFrame(slowDown);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    lastXRef.current = e.clientX;
    targetRateRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (lastXRef.current === null) return;
    if (e.buttons !== 1) { lastXRef.current = null; return; }
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    targetRateRef.current = -(deltaX / 6);
  };

  const handleMouseUp = () => {
    lastXRef.current = null;
    targetRateRef.current = 0;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (t) => {
    const s = Math.floor(t || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 z-10 flex-shrink-0">
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

      {/* Video — full screen */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          src={tour.panoramaUrl}
          className="w-full h-full object-cover"
          playsInline
          muted
          preload="auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ touchAction: 'none', cursor: 'grab', userSelect: 'none' }}
        />

        {/* Loading */}
        {!videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-white text-sm">Loading tour...</p>
            </div>
          </div>
        )}

        {/* Hint */}
        {showHint && videoReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <div className="flex items-center justify-center space-x-3 mb-1">
                <span className="text-2xl">👈</span>
                <span className="text-white font-bold text-base">Swipe to Look Around</span>
                <span className="text-2xl">👉</span>
              </div>
              <p className="text-gray-300 text-xs">Drag fast or slow — video follows your finger</p>
            </div>
          </div>
        )}

        {/* Simple time indicator — bottom left */}
        {videoReady && (
          <div className="absolute bottom-4 left-4 bg-black/50 rounded-full px-3 py-1">
            <span className="text-white text-xs font-medium">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        )}
      </div>

      {/* Simple progress bar — thin line at very bottom */}
      {videoReady && (
        <div className="h-1 bg-white/20 flex-shrink-0">
          <div className="h-full bg-blue-400 transition-none" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;