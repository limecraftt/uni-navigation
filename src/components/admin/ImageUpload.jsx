// src/components/admin/ImageUpload.jsx
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader, CheckCircle, AlertCircle, X, Lock } from 'lucide-react';
import { uploadCampusImage, createCampusImage } from '../../api/imagesApi';

const ImageUpload = ({ onSuccess, onClose, defaultLocation = null }) => {
  const isAddingToExisting = defaultLocation !== null;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0); // ← fixed: moved to state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [locationName, setLocationName] = useState(defaultLocation?.name || '');
  const [category, setCategory] = useState(defaultLocation?.category || 'academic');
  const [caption, setCaption] = useState('');
  const [walkingTime, setWalkingTime] = useState(defaultLocation?.walkingTime || '');
  const [displayOrder, setDisplayOrder] = useState(0);

  const categories = [
    { value: 'academic', label: 'Academic Buildings' },
    { value: 'recreational', label: 'Recreational Facilities' },
    { value: 'administrative', label: 'Administrative Offices' },
    { value: 'residential', label: 'Residential Halls' },
    { value: 'outdoor', label: 'Outdoor Spaces' }
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Maximum size is 10MB');
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setError(null);
    event.target.value = '';
  };

  const uploadImages = async () => {
    if (!locationName.trim()) {
      setError('Please enter a location name');
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);
      setUploadedCount(0);

      const totalFiles = selectedFiles.length;
      let count = 0;

      for (const file of selectedFiles) {
        const { data: uploadData, error: uploadError } = await uploadCampusImage(
          file,
          locationName.replace(/\s+/g, '-').toLowerCase()
        );
        if (uploadError) throw new Error(uploadError);

        const { error: dbError } = await createCampusImage({
          location_name: locationName,
          category: category,
          image_url: uploadData.publicUrl,
          caption: caption || null,
          walking_time: walkingTime || null,
          display_order: displayOrder + count
        });
        if (dbError) console.error('Database error:', dbError);

        count++;
        setUploadedCount(count); // ← update state so success screen can read it
        setUploadProgress(Math.round((count / totalFiles) * 100));
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload images');
      setUploading(false);
    }
  };

  const removeFile = (index) => setSelectedFiles(files => files.filter((_, i) => i !== index));
  const clearAllFiles = () => setSelectedFiles([]);

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Images Uploaded Successfully!</h3>
        <p className="text-gray-600">
          {uploadedCount} image{uploadedCount > 1 ? 's' : ''} added to <strong>{locationName}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isAddingToExisting ? `Add Images to ${defaultLocation.name}` : 'Upload Campus Images'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isAddingToExisting
              ? `New photos will be added directly to the ${defaultLocation.name} gallery`
              : 'Add photos to the virtual tour gallery'}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Locked location banner */}
      {isAddingToExisting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center space-x-3">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Images will be added to <strong>{defaultLocation.name}</strong>. Location details are locked to keep your gallery organized.
          </p>
        </div>
      )}

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

      {/* Image Metadata */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Image Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Location Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Name *</label>
            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => !isAddingToExisting && setLocationName(e.target.value)}
                placeholder="e.g., Main Library, Science Block"
                readOnly={isAddingToExisting}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  isAddingToExisting
                    ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'border-gray-300'
                }`}
              />
              {isAddingToExisting && (
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => !isAddingToExisting && setCategory(e.target.value)}
              disabled={isAddingToExisting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                isAddingToExisting
                  ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                  : 'border-gray-300'
              }`}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Walking Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Walking Time</label>
            <div className="relative">
              <input
                type="text"
                value={walkingTime}
                onChange={(e) => !isAddingToExisting && setWalkingTime(e.target.value)}
                placeholder="e.g., 5-10 min from main gate"
                readOnly={isAddingToExisting}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  isAddingToExisting
                    ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'border-gray-300'
                }`}
              />
              {isAddingToExisting && (
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption (Optional)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a description for these images..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Images</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {uploading ? (
              <div className="space-y-4">
                <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Uploading {uploadedCount} of {selectedFiles.length}...
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
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
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="font-semibold text-gray-900">Click to select images</p>
                  <p className="text-sm text-gray-600 mt-1">PNG, JPG, JPEG (Max 10MB each)</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    💡 Select multiple files at once, or click again to add more
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && !uploading && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Selected Files ({selectedFiles.length})</h4>
            <button onClick={clearAllFiles} className="text-sm text-red-600 hover:text-red-700 font-medium">
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-1.5 rounded-b-lg">
                  <p className="truncate">{file.name}</p>
                  <p className="text-gray-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {!uploading && selectedFiles.length > 0 && (
        <button
          onClick={uploadImages}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
        >
          <Upload className="w-5 h-5" />
          <span>
            Upload {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''} to {locationName || 'Location'}
          </span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;