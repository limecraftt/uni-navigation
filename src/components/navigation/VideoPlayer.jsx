import React, { useState, useRef, useEffect } from 'react';
import {
  SkipBack, SkipForward, RotateCcw,
  CheckCircle, Volume2, VolumeX
} from 'lucide-react';

const VideoPlayer = ({ clips, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const currentClip = clips[currentIndex];
  const isLast = currentIndex === clips.length - 1;

  // Auto play when clip changes
  useEffect(() => {
    if (videoRef.current) {
      setVideoError(false);
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const handleVideoEnd = () => {
    if (isLast) {
      setFinished(true);
      onComplete?.();
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      onComplete?.();
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // ── Arrived Screen ─────────────────────────────────────────────
  if (finished) {
    return (
      <div className="text-center py-10 px-4 space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">You've Arrived! 🎉</h3>
          <p className="text-gray-500 text-sm mt-1">
            You have reached your destination.
          </p>
        </div>
        <button
          onClick={() => {
            setFinished(false);
            setCurrentIndex(0);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold active:scale-95 transition-all"
        >
          Watch Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Progress Bar ─────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Step {currentIndex + 1} of {clips.length}
          </span>
          <span className="text-xs text-gray-400">
            {currentClip.from_location?.name} → {currentClip.to_location?.name}
          </span>
        </div>
        <div className="flex gap-1">
          {clips.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                i < currentIndex
                  ? 'bg-green-500'
                  : i === currentIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Video ────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-black">
        {videoError ? (
          <div className="w-full h-48 flex flex-col items-center justify-center text-white/60 space-y-2">
            <p className="text-sm">Video unavailable</p>
            <button
              onClick={() => {
                setVideoError(false);
                videoRef.current?.load();
                videoRef.current?.play();
              }}
              className="text-xs text-blue-400 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={currentClip.video_url}
            className="w-full max-h-64 md:max-h-72 object-cover"
            onEnded={handleVideoEnd}
            onError={() => setVideoError(true)}
            muted={muted}
            playsInline
            webkit-playsinline="true"
          />
        )}

        {/* Mute Button overlay */}
        <button
          onClick={() => setMuted(m => !m)}
          className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full text-white active:scale-95"
        >
          {muted
            ? <VolumeX className="w-4 h-4" />
            : <Volume2 className="w-4 h-4" />
          }
        </button>
      </div>

      {/* ── Instruction Card ─────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
        <p className="font-semibold text-gray-900 text-base leading-snug">
          {currentClip.instruction}
        </p>
        {currentClip.landmark_hint && (
          <div className="flex items-start gap-2">
            <span className="text-base">💡</span>
            <p className="text-sm text-amber-700">
              {currentClip.landmark_hint}
            </p>
          </div>
        )}
        {currentClip.duration_seconds > 0 && (
          <p className="text-xs text-gray-400">
            {currentClip.duration_seconds}s clip
          </p>
        )}
      </div>

      {/* ── Controls ─────────────────────────────────────────── */}
      <div className="flex gap-2">
        {/* Back */}
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold disabled:opacity-30 active:scale-95 transition-all"
        >
          <SkipBack className="w-4 h-4" />
          Back
        </button>

        {/* Replay */}
        <button
          onClick={handleReplay}
          className="px-4 py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Next / Finish */}
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all"
        >
          {isLast ? '🎉 Finish' : 'Next'}
          {!isLast && <SkipForward className="w-4 h-4" />}
        </button>
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 pt-1">
        {clips.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-4 h-2 bg-blue-600'
                : i < currentIndex
                ? 'w-2 h-2 bg-green-500'
                : 'w-2 h-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default VideoPlayer;