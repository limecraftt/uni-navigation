// src/components/navigation/VideoNavigation.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  RotateCcw,
  AlertCircle,
  Loader
} from 'lucide-react';

const VideoNavigation = ({ step, onVideoEnd, autoPlay = true }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
        setIsPlaying(false);
      });
    }
  }, [step.videoUrl, autoPlay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  // If no video URL, show 3D animation fallback
  if (!step.videoUrl) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold mb-2">Video Coming Soon</p>
          <p className="text-sm opacity-75">
            We're working on recording this route. For now, follow the text instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
      {/* Video Player */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={step.videoUrl}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          onClick={togglePlay}
          playsInline
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>

        {/* Loading Spinner */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <Loader className="w-12 h-12 text-white animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-90 text-white p-8"
            >
              <AlertCircle className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Video Failed to Load</h3>
              <p className="text-sm text-center mb-4">
                The video file couldn't be loaded. Please check your connection or try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white text-red-900 rounded-lg font-semibold hover:bg-gray-100"
              >
                Reload Page
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause Overlay */}
        <AnimatePresence>
          {!isPlaying && !isLoading && !hasError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
              onClick={togglePlay}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center"
              >
                <Play className="w-10 h-10 text-blue-600 ml-1" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Info Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-white font-semibold text-sm">
              Step {step.step}
            </p>
          </div>
          <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-white text-sm">
              {step.distance} • {step.duration}s
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-white bg-opacity-30 rounded-full mb-3 cursor-pointer"
            onClick={handleSeek}
          >
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={handleReplay}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Instruction Text Below Video */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <p className="font-semibold mb-1">{step.instruction}</p>
        {step.landmark && (
          <p className="text-sm text-blue-100">
            <span className="font-medium">Look for:</span> {step.landmark}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoNavigation;