// src/components/tour/PanoramaViewer.jsx
import React, { useRef, useState, useEffect } from 'react';

const PanoramaViewer = ({ tour, onClose }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    video.addEventListener('timeupdate', () => setCurrentTime(video.currentTime));
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

  const handleProgressClick = (e) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    v.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration;
  };

  const fmt = (t) => { const s = Math.floor(t || 0); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; };
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
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

      {videoReady && (
        <div className="bg-black flex-shrink-0 px-4 pt-3 pb-8">
          <div ref={progressRef} className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer relative" onClick={handleProgressClick}>
            <div className="h-full bg-blue-500 rounded-full" style={{width:`${progress}%`}} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow pointer-events-none" style={{left:`calc(${progress}% - 8px)`}} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs w-10">{fmt(currentTime)}</span>
            <div className="flex items-center gap-8">
              <button onClick={(e)=>{e.stopPropagation();skip(-5);}} className="text-white active:scale-90 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/></svg>
              </button>
              <button onClick={(e)=>{e.stopPropagation();togglePlay();}} className="bg-white rounded-full p-3.5 active:scale-90 transition-transform shadow-lg">
                {isPlaying
                  ? <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  : <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                }
              </button>
              <button onClick={(e)=>{e.stopPropagation();skip(5);}} className="text-white active:scale-90 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/></svg>
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