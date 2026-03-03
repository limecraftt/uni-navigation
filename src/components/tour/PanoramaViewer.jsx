// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect } from 'react';

const PanoramaViewer = ({ tour, onClose }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isDraggingRef = useRef(false);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let ready = false;
    const onReady = () => {
      if (ready) return;
      ready = true;
      setDuration(video.duration || 0);
      setVideoReady(true);
      video.playbackRate = 0.4;
      video.play().catch(() => {});
    };
    video.addEventListener('loadedmetadata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('timeupdate', () => { if (!isDraggingRef.current) setCurrentTime(video.currentTime); });
    video.addEventListener('ended', () => { video.currentTime = 0; video.play(); });
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('play', () => setIsPlaying(true));
    return () => { video.src = ''; };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.playbackRate = 0.4; v.play().catch(() => {}); }
    else v.pause();
  };

  const skip = (s) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + s));
  };

  // Get ratio from any pointer/touch event relative to progress bar
  const getRatio = (clientX) => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const seekTo = (ratio) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    wasPlayingRef.current = !videoRef.current?.paused;
    videoRef.current?.pause();
    seekTo(getRatio(e.clientX));
  };

  useEffect(() => {
    const onMouseMove = (e) => { if (isDraggingRef.current) seekTo(getRatio(e.clientX)); };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (wasPlayingRef.current && videoRef.current) {
        videoRef.current.playbackRate = 0.4;
        videoRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, [duration]);

  // Touch events on progress bar
  const handleTouchStart = (e) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    wasPlayingRef.current = !videoRef.current?.paused;
    videoRef.current?.pause();
    seekTo(getRatio(e.touches[0].clientX));
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    if (!isDraggingRef.current) return;
    seekTo(getRatio(e.touches[0].clientX));
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    if (wasPlayingRef.current && videoRef.current) {
      videoRef.current.playbackRate = 0.4;
      videoRef.current.play().catch(() => {});
    }
  };

  const fmt = (t) => { const s = Math.floor(t || 0); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; };
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 flex-shrink-0">
        <div>
          <h2 className="text-white font-bold text-base">{tour.title}</h2>
          {tour.description && <p className="text-gray-400 text-xs">{tour.description}</p>}
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 relative overflow-hidden" onClick={togglePlay}>
        <video ref={videoRef} src={tour.panoramaUrl} className="w-full h-full object-cover" playsInline muted preload="auto" />
        {!videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-white text-sm">Loading tour...</p>
            </div>
          </div>
        )}
        {videoReady && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-5">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}
        {videoReady && (
          <div className="absolute top-3 left-3 bg-purple-600/80 text-white px-2 py-1 rounded-full text-xs font-bold pointer-events-none">360° Tour</div>
        )}
      </div>

      {/* Controls */}
      {videoReady && (
        <div className="bg-black flex-shrink-0 px-4 pt-4 pb-8">

          {/* Draggable progress bar — bigger touch area */}
          <div
            ref={progressRef}
            className="w-full relative flex items-center cursor-pointer mb-4"
            style={{ height: '36px' }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Track */}
            <div className="absolute w-full h-1.5 bg-white/20 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            {/* Draggable thumb */}
            <div
              className="absolute w-5 h-5 bg-white rounded-full shadow-lg border-2 border-blue-400"
              style={{ left: `calc(${progress}% - 10px)`, touchAction: 'none' }}
            />
          </div>

          {/* Time + Buttons */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs w-10">{fmt(currentTime)}</span>
            <div className="flex items-center gap-8">
              <button onClick={(e) => { e.stopPropagation(); skip(-5); }} className="text-white active:scale-90 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                </svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="bg-white rounded-full p-3.5 active:scale-90 transition-transform shadow-lg">
                {isPlaying
                  ? <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  : <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                }
              </button>
              <button onClick={(e) => { e.stopPropagation(); skip(5); }} className="text-white active:scale-90 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                </svg>
              </button>
            </div>
            <span className="text-gray-400 text-xs w-10 text-right">{fmt(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;