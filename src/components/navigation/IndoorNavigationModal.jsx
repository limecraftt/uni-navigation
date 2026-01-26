// src/components/navigation/IndoorNavigationModal.jsx - WITH SUPABASE QR INTEGRATION
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  QrCode,
  Download,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Video,
  Layout,
  Loader
} from 'lucide-react';
import AnimatedNavigation3D from './AnimatedNavigation3D';
import VideoNavigation from './VideoNavigation';
import QRCodeGenerator from './QRCodeGenerator';
import useQRGeneration from '../../hooks/useQRGeneration';

const IndoorNavigationModal = ({ office, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const [viewMode, setViewMode] = useState('video'); // 'video' or '3d'

  // QR Code generation hook
  const { 
    qrData, 
    qrCodeUrl, 
    loading: qrLoading,
    downloadQRCode,
    shareQRCode,
    generateAndUploadQRCode
  } = useQRGeneration(office);

  // Get route steps for this office
  const routeSteps = office.indoorRoute || [];
  const totalSteps = routeSteps.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  // Check if current step has video
  const currentStepHasVideo = routeSteps[currentStep]?.videoUrl;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleVideoEnd = () => {
    // Auto-advance to next step when video ends
    if (currentStep < totalSteps - 1) {
      setTimeout(() => handleNext(), 1000);
    }
  };

  const handleDownloadQR = async () => {
    // First generate and upload if not already done
    if (!qrCodeUrl) {
      await generateAndUploadQRCode();
    }
    downloadQRCode();
  };

  const handleShareQR = async () => {
    await shareQRCode();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex-shrink-0">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 truncate">Indoor Navigation</h2>
                <p className="text-blue-100 text-sm truncate">
                  {office.name} • Room {office.room}
                </p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                {/* View Mode Toggle */}
                {currentStepHasVideo && (
                  <button
                    onClick={() => setViewMode(viewMode === 'video' ? '3d' : 'video')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title={viewMode === 'video' ? 'Switch to 3D View' : 'Switch to Video'}
                  >
                    {viewMode === 'video' ? (
                      <Layout className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Show QR Code"
                >
                  <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {routeSteps.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Video or 3D Navigation */}
                <AnimatePresence mode="wait">
                  {viewMode === 'video' && currentStepHasVideo ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <VideoNavigation 
                        step={routeSteps[currentStep]}
                        onVideoEnd={handleVideoEnd}
                        autoPlay={true}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="3d"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <AnimatedNavigation3D 
                        route={routeSteps} 
                        currentStep={currentStep} 
                      />
                      {/* Text Instructions for 3D mode */}
                      <div className="mt-4 bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                          Step {currentStep + 1}: {routeSteps[currentStep].instruction}
                        </h3>
                        {routeSteps[currentStep].landmark && (
                          <p className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Look for:</span> {routeSteps[currentStep].landmark}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* View Mode Hint */}
                {currentStepHasVideo && (
                  <div className="text-center">
                    <button
                      onClick={() => setViewMode(viewMode === 'video' ? '3d' : 'video')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {viewMode === 'video' ? '📐 Switch to 3D View' : '🎥 Switch to Video View'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Indoor Route Available
                </h3>
                <p className="text-gray-600">
                  Indoor navigation for this location is coming soon.
                </p>
              </div>
            )}
          </div>

          {/* Footer Navigation - Fixed at bottom */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t flex-shrink-0">
            {/* Mobile Layout */}
            <div className="flex flex-col space-y-3 sm:hidden">
              <div className="text-center text-sm text-gray-600">
                {currentStep === totalSteps - 1
                  ? '🎉 You\'ve arrived!'
                  : `${totalSteps - currentStep - 1} steps remaining`}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    currentStep === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                {currentStep === totalSteps - 1 ? (
                  <button
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Done</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="text-center px-4">
                <p className="text-sm text-gray-600">
                  {currentStep === totalSteps - 1
                    ? '🎉 You\'ve arrived!'
                    : `${totalSteps - currentStep - 1} steps remaining`}
                </p>
              </div>

              {currentStep === totalSteps - 1 ? (
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Done</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setShowQRCode(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">Share Directions</h2>
                    <p className="text-sm text-gray-600 truncate">{office.name}</p>
                  </div>
                  <button
                    onClick={() => setShowQRCode(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* QR Code Display */}
                <div id="qr-code-canvas" className="bg-white p-4 sm:p-6 rounded-xl border-4 border-blue-100 mb-6 flex items-center justify-center">
                  {qrLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <p className="text-sm text-gray-600">Generating QR Code...</p>
                    </div>
                  ) : qrData ? (
                    <QRCodeGenerator value={qrData} size={256} />
                  ) : (
                    <div className="py-16 text-center">
                      <p className="text-sm text-gray-600">QR Code unavailable</p>
                    </div>
                  )}
                </div>

                {/* Saved Badge */}
                {qrCodeUrl && (
                  <div className="mb-4 flex items-center justify-center space-x-2 text-sm text-green-600 bg-green-50 py-2 px-4 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>QR Code saved to cloud</span>
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>How to use:</span>
                  </h3>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>Open phone camera</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Point at QR code</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>Tap notification to navigate</span>
                    </li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadQR}
                    disabled={qrLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {qrLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleShareQR}
                    disabled={qrLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default IndoorNavigationModal;