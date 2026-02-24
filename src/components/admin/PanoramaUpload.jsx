// src/components/admin/PanoramaUpload.jsx
import React, { useState } from 'react';
import { Upload, Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadPanorama, createPanorama } from '../../api/imagesApi';

const PanoramaUpload = ({ onSuccess, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Panorama metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('3-5 min');
  const [highlights, setHighlights] = useState(['']);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 20MB for panoramas)
    if (file.size > 20 * 1024 * 1024) {
      setError('Image file is too large. Maximum size is 20MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const uploadPanoramaImage = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!selectedFile) {
      setError('Please select a panorama image');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(20);

      // Upload panorama to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadPanorama(
        selectedFile,
        title
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      setUploadProgress(60);

      // Filter out empty highlights
      const validHighlights = highlights.filter(h => h.trim() !== '');

      // Create panorama record in database
      const { error: dbError } = await createPanorama({
        title: title,
        description: description || null,
        panorama_url: uploadData.publicUrl,
        duration: duration,
        highlights: validHighlights.length > 0 ? validHighlights : null,
        display_order: displayOrder,
        is_available: isAvailable
      });

      if (dbError) {
        throw new Error(dbError);
      }

      setUploadProgress(100);
      setSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload panorama');
      setUploading(false);
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const removeHighlight = (index) => {
    if (highlights.length === 1) return;
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const updateHighlight = (index, value) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">360° Panorama Uploaded!</h3>
        <p className="text-gray-600">{title} has been added to the virtual tour</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload 360° Panorama</h2>
          <p className="text-gray-600 mt-1">Add an immersive 360° tour experience</p>
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

      {/* Panorama Metadata */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Tour Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Main Campus Entrance"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what viewers will see in this tour..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 3-5 min"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="available"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              Make this tour available immediately
            </label>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Tour Highlights</h3>
          <button
            onClick={addHighlight}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Add Highlight
          </button>
        </div>

        <div className="space-y-2">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                placeholder={`Highlight ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {highlights.length > 1 && (
                <button
                  onClick={() => removeHighlight(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          360° Panorama Image *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="panorama-upload"
          />
          <label htmlFor="panorama-upload" className="cursor-pointer">
            {uploading ? (
              <div className="space-y-4">
                <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                <div>
                  <p className="font-semibold text-gray-900">Uploading...</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="space-y-3">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-48 mx-auto rounded-lg"
                />
                <p className="text-sm font-semibold text-gray-900">{selectedFile?.name}</p>
                <p className="text-xs text-gray-600">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Click to upload 360° panorama</p>
                  <p className="text-sm text-gray-600 mt-1">PNG, JPG, JPEG (Max 20MB)</p>
                  <p className="text-xs text-gray-500 mt-1">Use equirectangular projection for best results</p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Upload Button */}
      {!uploading && selectedFile && (
        <button
          onClick={uploadPanoramaImage}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Panorama</span>
        </button>
      )}
    </div>
  );
};

export default PanoramaUpload;