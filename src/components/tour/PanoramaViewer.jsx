// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';

const FRAME_COUNT = 10;

const getCloudinaryThumbnails = (videoUrl, count) => {
  try {
    const match = videoUrl.match(/\/video\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!match) return null;
    const publicId = match[1];
    const cloudName = videoUrl.match(/res\.cloudinary\.com\/([^/]+)/)?.[1];
    if (!cloudName) return null;
    return Array.from({ length: count }, (_, i) => {
      const offset = Math.round((i / (count - 1)) * 100);
      return `https://res.cloudinary.com/${cloudName}/video/upload/so_${offset}p,w_120,h_80,c_fill,q_auto/${publicId}.jpg`;
    });
  } catch { return null; }
};

const PanoramaViewer = ({ tour, onClose, isLoading }) => {
  const videoRef = useRef(null);
  const filmstripRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastXRef = useRef(null);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const thumbnails = tour.panoramaUrl ? getCloudinaryThumbnails(tour.panoramaUrl, FRAME_COUNT) : null;

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Track currentTime with requestAnimationFrame for smooth UI updates
  useEffect(() => {
    const tick = () => {
      const video = videoRef.current;
      if (video) setCurrentTime(video.currentTime);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      setDuration(video.duration);
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };

    const onCanPlay = () => {
      if (!videoReady) {
        setDuration(video.duration);
        setVideoReady(true);
      }
      video.pause();
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('canplay', onCanPlay);
    // Loop video silently
    video.addEventListener('ended', () => { video.currentTime = 0; video.pause(); });

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [tour.panoramaUrl]);

  // Smooth scrub using playbackRate + short play bursts
  const smoothScrub = useCallback((deltaX) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    // Map drag delta to playback speed
    // Negative deltaX = drag left = go forward in video
    const speed = -(deltaX / 8); // sensitivity
    velocityRef.current = speed;

    if (Math.abs(speed) < 0.1) {
      video.pause();
      return;
    }

    if (speed > 0) {
      // Forward
      video.playbackRate = Math.min(speed, 8);
      if (video.paused) video.play();
    } else {
      // Backward — use seeking with small steps (browsers don't support negative playback)
      video.pause();
      const step = Math.abs(speed) * 0.05;
      const newTime = Math.max(0, video.currentTime - step);
      video.currentTime = newTime;
    }

    // Boundary check
    if (video.currentTime >= duration - 0.1) {
      video.currentTime = duration - 0.1;
      video.pause();
    }
    if (video.currentTime <= 0.01) {
      video.currentTime = 0.01;
    }
  }, [duration]);

  const stopScrub = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.playbackRate = 1;
  }, []);

  // Touch on video — most important, swipe left/right
  const handleVideoTouchStart = (e) => {
    lastXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    setShowHint(false);
    const video = videoRef.current;
    if (video) video.pause();
  };

  const handleVideoTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!isDraggingRef.current || lastXRef.current === null) return;
    const deltaX = e.touches[0].clientX - lastXRef.current;
    lastXRef.current = e.touches[0].clientX;
    smoothScrub(deltaX);
  }, [smoothScrub]);

  const handleVideoTouchEnd = () => {
    isDraggingRef.current = false;
    lastXRef.current = null;
    stopScrub();
  };

  // Filmstrip click/drag — seek directly (acceptable since user clicked a specific spot)
  const scrubToPosition = useCallback((clientX) => {
    const strip = filmstripRef.current;
    const video = videoRef.current;
    if (!strip || !video || !duration) return;
    const rect = strip.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
    video.pause();
  }, [duration]);

  const [stripDragging, setStripDragging] = useState(false);

  const handleStripMouseDown = (e) => { setStripDragging(true); scrubToPosition(e.clientX); };
  const handleStripMouseMove = useCallback((e) => { if (stripDragging) scrubToPosition(e.clientX); }, [stripDragging, scrubToPosition]);
  const handleStripMouseUp = useCallback(() => setStripDragging(false), []);

  useEffect(() => {
    if (stripDragging) {
      window.addEventListener('mousemove', handleStripMouseMove);
      window.addEventListener('mouseup', handleStripMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleStripMouseMove);
      window.removeEventListener('mouseup', handleStripMouseUp);
    };
  }, [stripDragging, handleStripMouseMove, handleStripMouseUp]);

  const handleStripTouchStart = (e) => scrubToPosition(e.touches[0].clientX);
  const handleStripTouchMove = (e) => { e.preventDefault(); scrubToPosition(e.touches[0].clientX); };

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
          style={{ touchAction: 'none', cursor: 'grab' }}
        />

        {!videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {showHint && videoReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <div className="flex items-center justify-center space-x-3 mb-1">
                <span className="text-2xl">👈</span>
                <span className="text-white font-bold text-base">Swipe to Explore</span>
                <span className="text-2xl">👉</span>
              </div>
              <p className="text-gray-300 text-xs">Drag on video or use filmstrip below</p>
            </div>
          </div>
        )}
      </div>

      {/* Filmstrip */}
      <div className="bg-black flex-shrink-0 pt-2 pb-6">
        <div className="flex justify-between text-xs px-4 mb-2">
          <span className="text-white font-medium">{formatTime(currentTime)}</span>
          <span className="text-gray-500">{formatTime(duration)}</span>
        </div>

        <div
          ref={filmstripRef}
          className="relative overflow-hidden"
          style={{ height: '70px', touchAction: 'none', cursor: 'col-resize' }}
          onMouseDown={handleStripMouseDown}
          onTouchStart={handleStripTouchStart}
          onTouchMove={handleStripTouchMove}
        >
          <div className="flex w-full h-full">
            {thumbnails ? (
              thumbnails.map((src, i) => (
                <img key={i} src={src} className="flex-1 h-full object-cover border-r border-black"
                  style={{ minWidth: 0 }} draggable={false}
                  onError={(e) => { e.target.style.background = '#1f2937'; }} />
              ))
            ) : (
              Array.from({ length: FRAME_COUNT }).map((_, i) => (
                <div key={i} className="flex-1 h-full bg-gray-800 border-r border-black" />
              ))
            )}
          </div>

          {/* Position line */}
          <div className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${progress}%`, width: '2px', background: 'white',
              boxShadow: '0 0 8px rgba(255,255,255,0.9)', transform: 'translateX(-1px)' }}>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2"
              style={{ width: 0, height: 0, borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent', borderTop: '6px solid white' }} />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2"
              style={{ width: 0, height: 0, borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent', borderBottom: '6px solid white' }} />
          </div>

          {/* Dimmed unvisited */}
          <div className="absolute top-0 right-0 bottom-0 bg-black/30 pointer-events-none"
            style={{ left: `${progress}%` }} />
        </div>

        {tour.highlights && tour.highlights.length > 0 && (
          <div className="flex gap-2 mt-3 px-4 overflow-x-auto scrollbar-hide">
            {tour.highlights.map((h, i) => (
              <span key={i} className="flex-shrink-0 px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20">{h}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanoramaViewer;