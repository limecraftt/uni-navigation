// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';

const FRAME_COUNT = 12; // number of filmstrip frames to show

const PanoramaViewer = ({ tour, onClose, isLoading }) => {
  const videoRef = useRef(null);
  const filmstripRef = useRef(null);
  const canvasRefs = useRef([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [frames, setFrames] = useState([]); // captured frame images
  const [framesReady, setFramesReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const lastX = useRef(null);

  // Hide hint after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;

    const onLoaded = async () => {
      setDuration(video.duration);
      setVideoReady(true);
      video.pause();
      // Capture frames for filmstrip
      await captureFrames(video, video.duration);
    };

    video.addEventListener('loadeddata', onLoaded);
    // Prevent autoplay
    video.addEventListener('play', () => video.pause());
    return () => {
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [tour.panoramaUrl]);

  const captureFrames = async (video, dur) => {
    const offscreen = document.createElement('canvas');
    offscreen.width = 120;
    offscreen.height = 80;
    const ctx = offscreen.getContext('2d');
    const captured = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const t = (i / (FRAME_COUNT - 1)) * dur;
      await seekTo(video, t);
      ctx.drawImage(video, 0, 0, 120, 80);
      captured.push(offscreen.toDataURL('image/jpeg', 0.6));
    }

    setFrames(captured);
    setFramesReady(true);
    // Reset to start
    video.currentTime = 0;
    setCurrentTime(0);
  };

  const seekTo = (video, time) => new Promise((resolve) => {
    video.currentTime = time;
    const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve(); };
    video.addEventListener('seeked', onSeeked);
  });

  const scrubVideo = useCallback((time) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const clamped = Math.max(0, Math.min(duration, time));
    video.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Touch scrubbing on video — swipe left/right
  const handleVideoTouchStart = (e) => {
    lastX.current = e.touches[0].clientX;
    setIsDragging(true);
    setShowHint(false);
  };

  const handleVideoTouchMove = (e) => {
    e.preventDefault();
    if (lastX.current === null) return;
    const deltaX = e.touches[0].clientX - lastX.current;
    lastX.current = e.touches[0].clientX;
    // Sensitivity: full screen width = full video duration
    const timeDelta = -(deltaX / window.innerWidth) * duration * 1.5;
    scrubVideo(currentTime + timeDelta);
  };

  const handleVideoTouchEnd = () => {
    lastX.current = null;
    setIsDragging(false);
  };

  // Filmstrip drag/touch
  const scrubFromFilmstripX = useCallback((clientX) => {
    const strip = filmstripRef.current;
    if (!strip || !duration) return;
    const rect = strip.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    scrubVideo(ratio * duration);
  }, [duration, scrubVideo]);

  const handleStripMouseDown = (e) => {
    setIsDragging(true);
    scrubFromFilmstripX(e.clientX);
  };

  const handleStripMouseMove = useCallback((e) => {
    if (!isDragging) return;
    scrubFromFilmstripX(e.clientX);
  }, [isDragging, scrubFromFilmstripX]);

  const handleStripMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleStripMouseMove);
      window.addEventListener('mouseup', handleStripMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleStripMouseMove);
      window.removeEventListener('mouseup', handleStripMouseUp);
    };
  }, [isDragging, handleStripMouseMove, handleStripMouseUp]);

  const handleStripTouchStart = (e) => {
    scrubFromFilmstripX(e.touches[0].clientX);
  };

  const handleStripTouchMove = (e) => {
    e.preventDefault();
    scrubFromFilmstripX(e.touches[0].clientX);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (t) => {
    const s = Math.floor(t);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 z-10 flex-shrink-0">
        <div className="min-w-0">
          <h2 className="text-white font-bold text-base md:text-lg truncate">{tour.title}</h2>
          {tour.description && (
            <p className="text-gray-400 text-xs truncate">{tour.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 p-2 bg-white/10 hover:bg-white/20 rounded-full"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={tour.panoramaUrl}
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

            {/* Frames loading overlay */}
            {videoReady && !framesReady && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-black/60 rounded-full px-4 py-2 flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="text-white text-xs">Preparing filmstrip...</span>
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
                  <p className="text-gray-300 text-xs">Swipe on video or drag the bar below</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filmstrip Scrubber */}
      <div className="bg-black flex-shrink-0 pt-2 pb-4 px-0">
        {/* Time */}
        <div className="flex justify-between text-xs text-gray-500 px-4 mb-2">
          <span className="text-white">{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Filmstrip */}
        <div
          ref={filmstripRef}
          className="relative overflow-hidden cursor-pointer"
          onMouseDown={handleStripMouseDown}
          onTouchStart={handleStripTouchStart}
          onTouchMove={handleStripTouchMove}
          style={{ touchAction: 'none', height: '72px', cursor: 'col-resize' }}
        >
          {/* Frame images */}
          <div className="flex w-full h-full">
            {framesReady ? (
              frames.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="flex-1 h-full object-cover"
                  style={{ minWidth: 0 }}
                  draggable={false}
                />
              ))
            ) : (
              // Placeholder skeleton while frames load
              Array.from({ length: FRAME_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-full bg-gray-800 border-r border-gray-900 animate-pulse"
                />
              ))
            )}
          </div>

          {/* Vertical position indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
            style={{
              left: `${progress}%`,
              boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            }}
          >
            {/* Top triangle */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '8px solid white' }} />
            {/* Bottom triangle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid white' }} />
          </div>
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