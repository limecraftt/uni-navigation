// src/components/navigation/AnimatedNavigation3D.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Footprints } from 'lucide-react';

const AnimatedNavigation3D = ({ route, currentStep }) => {
  const step = route[currentStep];
  
  const getDirectionIcon = (direction) => {
    switch(direction) {
      case 'forward': return '↑';
      case 'left': return '←';
      case 'right': return '→';
      case 'stairs-up': return '⤴';
      case 'stairs-down': return '⤵';
      case 'arrived': return '★';
      default: return '•';
    }
  };

  const getDirectionColor = (direction) => {
    switch(direction) {
      case 'forward': return 'from-blue-500 to-blue-600';
      case 'left': return 'from-purple-500 to-purple-600';
      case 'right': return 'from-green-500 to-green-600';
      case 'stairs-up': return 'from-orange-500 to-orange-600';
      case 'arrived': return 'from-emerald-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* 3D Perspective View */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Corridor/Path Visualization */}
          <div className="relative w-80 h-80">
            {/* Floor Grid */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.2 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute w-full h-px bg-cyan-400"
                  style={{ 
                    bottom: `${i * 12.5}%`,
                    transform: `perspective(400px) rotateX(60deg)`
                  }}
                />
              ))}
            </div>

            {/* Direction Indicator - Large Arrow */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
              className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br ${getDirectionColor(step.direction)} rounded-full flex items-center justify-center shadow-2xl`}
            >
              <span className="text-6xl text-white font-bold">
                {getDirectionIcon(step.direction)}
              </span>
            </motion.div>

            {/* Animated Path Line */}
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <svg className="w-full h-full" viewBox="0 0 320 320">
                <motion.path
                  d="M160 320 L160 160"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Pulsing Dot - Current Position */}
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5 
              }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full shadow-lg"
            />
          </div>
        </motion.div>
      </div>

      {/* Distance & Duration Overlay */}
      <div className="absolute top-6 left-6 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
        <div className="flex items-center space-x-2 text-sm mb-1">
          <Footprints className="w-4 h-4" />
          <span className="font-semibold">{step.distance}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-300">
          <span>~{step.duration}s</span>
        </div>
      </div>

      {/* Step Counter */}
      <div className="absolute top-6 right-6 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
        <div className="text-2xl font-bold">{currentStep + 1}</div>
        <div className="text-xs text-gray-300">of {route.length}</div>
      </div>

      {/* Landmark Info */}
      <div className="absolute bottom-6 left-6 right-6 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl px-5 py-4 text-white">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">{step.landmark}</p>
            <p className="text-xs text-gray-300">{step.instruction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedNavigation3D;