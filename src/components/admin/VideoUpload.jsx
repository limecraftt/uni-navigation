// src/components/admin/VideoUpload.jsx
import React, { useState } from 'react';
import { Upload, Video, Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadNavigationVideo, createNavigationVideo, createNavigationInstruction } from '../../api/officesApi';

const VideoUpload = ({ office, onSuccess, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Video metadata
  const [stepNumber, setStepNumber] = useState(1);
  const [startingPoint, setStartingPoint] = useState('Main Gate');
  const [duration, setDuration] = useState('');
  
  // Instructions
  const [instructions, setInstructions] = useState([
    { 
      sequence_order: 1, 
      instruction_type: 'go_straight',
      instruction_text: '',
      landmark: '',
      distance: '',
      timestamp_seconds: 0
    }
  ]);

  const instructionTypes = [
    { value: 'go_straight', label: 'Go Straight' },
    { value: 'turn_right', label: 'Turn Right' },
    { value: 'turn_left', label: 'Turn Left' },
    { value: 'climb_stairs', label: 'Climb Stairs' },
    { value: 'descend_stairs', label: 'Descend Stairs' },
    { value: 'enter_building', label: 'Enter Building' },
    { value: 'exit_building', label: 'Exit Building' },
    { value: 'arrive', label: 'Arrive at Destination' }
  ];

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file is too large. Maximum size is 100MB');
      return;
    }

    await uploadVideo(file);
  };

  const uploadVideo = async (file) => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(20);

      // Upload video to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadNavigationVideo(
        file,
        office.office_id,
        stepNumber
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      setUploadProgress(50);

      // Create video record in database
      const { data: videoData, error: videoError } = await createNavigationVideo({
        office_id: office.id,
        video_url: uploadData.publicUrl,
        starting_point: startingPoint,
        step_number: stepNumber,
        duration: parseInt(duration) || 30
      });

      if (videoError) {
        throw new Error(videoError);
      }

      setUploadProgress(70);

      // Create navigation instructions
      for (const instruction of instructions) {
        const { error: instructionError } = await createNavigationInstruction({
          video_id: videoData.id,
          sequence_order: instruction.sequence_order,
          instruction_type: instruction.instruction_type,
          instruction_text: instruction.instruction_text,
          landmark: instruction.landmark || null,
          distance: instruction.distance || null,
          timestamp_seconds: parseFloat(instruction.timestamp_seconds) || 0
        });

        if (instructionError) {
          console.error('Error creating instruction:', instructionError);
        }
      }

      setUploadProgress(100);
      setSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video');
      setUploading(false);
    }
  };

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      {
        sequence_order: instructions.length + 1,
        instruction_type: 'go_straight',
        instruction_text: '',
        landmark: '',
        distance: '',
        timestamp_seconds: 0
      }
    ]);
  };

  const removeInstruction = (index) => {
    if (instructions.length === 1) return; // Keep at least one
    const updated = instructions.filter((_, i) => i !== index);
    // Re-sequence
    updated.forEach((inst, i) => inst.sequence_order = i + 1);
    setInstructions(updated);
  };

  const updateInstruction = (index, field, value) => {
    const updated = [...instructions];
    updated[index][field] = value;
    setInstructions(updated);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Video Uploaded Successfully!</h3>
        <p className="text-gray-600">The navigation video has been saved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Navigation Video</h2>
          <p className="text-gray-600 mt-1">For {office.name}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900">Upload Failed</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Video Metadata */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Video Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step Number
            </label>
            <input
              type="number"
              value={stepNumber}
              onChange={(e) => setStepNumber(parseInt(e.target.value))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Point
            </label>
            <input
              type="text"
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              placeholder="e.g., Main Gate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation Instructions */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Navigation Instructions</h3>
          <button
            onClick={addInstruction}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Add Step
          </button>
        </div>

        <div className="space-y-4">
          {instructions.map((instruction, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">Step {instruction.sequence_order}</span>
                {instructions.length > 1 && (
                  <button
                    onClick={() => removeInstruction(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Instruction Type
                  </label>
                  <select
                    value={instruction.instruction_type}
                    onChange={(e) => updateInstruction(index, 'instruction_type', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {instructionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Timestamp (seconds)
                  </label>
                  <input
                    type="number"
                    value={instruction.timestamp_seconds}
                    onChange={(e) => updateInstruction(index, 'timestamp_seconds', e.target.value)}
                    placeholder="0"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Instruction Text *
                  </label>
                  <input
                    type="text"
                    value={instruction.instruction_text}
                    onChange={(e) => updateInstruction(index, 'instruction_text', e.target.value)}
                    placeholder="e.g., Turn right at the fountain"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={instruction.landmark}
                    onChange={(e) => updateInstruction(index, 'landmark', e.target.value)}
                    placeholder="e.g., Large fountain"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Distance
                  </label>
                  <input
                    type="text"
                    value={instruction.distance}
                    onChange={(e) => updateInstruction(index, 'distance', e.target.value)}
                    placeholder="e.g., 15m"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Video File
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            {uploading ? (
              <div className="space-y-4">
                <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                <div>
                  <p className="font-semibold text-gray-900">Uploading...</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Video className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="font-semibold text-gray-900">Click to upload video</p>
                  <p className="text-sm text-gray-600 mt-1">MP4, MOV, AVI (Max 100MB)</p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;