// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';

const PanoramaViewer = ({ tour, onClose }) => {
  const videoRef = useRef(null);
  const sliderRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [lastTouchX, setLastTouchX] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.pause();

    const handleLoaded = () => {
      setDuration(video.duration);
      setVideoReady(true);
      video.currentTime = 0;
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    return () => video.removeEventListener('loadedmetadata', handleLoaded);
  }, [tour.panoramaUrl]);

  const seekTo = useCallback((time) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const clamped = Math.max(0, Math.min(duration, time));
    video.currentTime = clamped;
    setCurrentTime(clamped);
    setHasInteracted(true);
  }, [duration]);

  const positionToTime = useCallback((clientX) => {
    const slider = sliderRef.current;
    if (!slider || !duration) return 0;
    const rect = slider.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * duration;
  }, [duration]);

  // Mouse slider
  const handleSliderMouseDown = (e) => {
    setIsDragging(true);
    seekTo(positionToTime(e.clientX));
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    seekTo(positionToTime(e.clientX));
  }, [isDragging, seekTo, positionToTime]);

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

  // Touch drag on video
  const handleVideoTouchStart = (e) => {
    setLastTouchX(e.touches[0].clientX);
  };

  const handleVideoTouchMove = (e) => {
    e.preventDefault();
    const x = e.touches[0].clientX;
    const delta = lastTouchX - x; // positive = drag left = go forward
    setLastTouchX(x);
    seekTo(currentTime + delta * 0.05);
  };

  const handleVideoTouchEnd = () => setLastTouchX(null);

  // Touch on slider
  const handleSliderTouchStart = (e) => {
    setIsDragging(true);
    seekTo(positionToTime(e.touches[0].clientX));
  };

  const handleSliderTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging) return;
    seekTo(positionToTime(e.touches[0].clientX));
  };

  const handleSliderTouchEnd = () => setIsDragging(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base md:text-xl truncate">{tour.title}</h2>
          {tour.description && (
            <p className="text-white/50 text-xs truncate">{tour.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={tour.panoramaUrl}
          className="w-full h-full object-cover select-none"
          muted
          playsInline
          preload="auto"
          onTouchStart={handleVideoTouchStart}
          onTouchMove={handleVideoTouchMove}
          onTouchEnd={handleVideoTouchEnd}
          style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        />

        {/* Loading */}
        {!videoReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
            <p className="text-white/60 text-sm">Loading 360° tour...</p>
          </div>
        )}

        {/* First-time hint */}
        {videoReady && !hasInteracted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-5 text-center mx-6">
              <div className="flex items-center justify-center gap-3 text-white mb-2">
                <span className="text-3xl">👈</span>
                <span className="text-xl font-bold">Drag to Explore</span>
                <span className="text-3xl">👉</span>
              </div>
              <p className="text-white/50 text-sm">Swipe on video or drag the bar below</p>
            </div>
          </div>
        )}
      </div>

      {/* Scrubber */}
      <div className="bg-black px-4 pt-4 pb-8 md:pb-5">
        {/* Slider */}
        <div
          ref={sliderRef}
          className="relative w-full h-10 flex items-center cursor-pointer"
          onMouseDown={handleSliderMouseDown}
          onTouchStart={handleSliderTouchStart}
          onTouchMove={handleSliderTouchMove}
          onTouchEnd={handleSliderTouchEnd}
          style={{ touchAction: 'none' }}
        >
          {/* Track */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-visible relative">
            {/* Fill */}
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Time labels */}
        <div className="flex justify-between mt-2">
          <span className="text-white/40 text-xs">{formatTime(currentTime)}</span>
          <span className="text-white/25 text-xs hidden md:block">← drag to look around →</span>
          <span className="text-white/40 text-xs">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

export default PanoramaViewer;