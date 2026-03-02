// src/pages/AdminPanoramas.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Loader, AlertCircle, Trash2, Eye, Layout, Globe, Upload, X } from 'lucide-react';
import { getAllPanoramas, deletePanorama, uploadVideoToCloudinary, createPanorama } from '../api/imagesApi';

// ==================== UPLOAD MODAL ====================
const UploadModal = ({ onClose, onSuccess }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('video/')) {
      setError('Please select a video file (MP4, MOV, etc.)');
      return;
    }
    if (selected.size > 100 * 1024 * 1024) {
      setError('File too large. Maximum size is 100MB.');
      return;
    }
    setFile(selected);
    setError('');
    if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError('Please select a video and enter a title.');
      return;
    }
    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const { data: cloudData, error: cloudError } = await uploadVideoToCloudinary(file, setProgress);
      if (cloudError) throw new Error(cloudError);

      const { error: dbError } = await createPanorama({
        title: title.trim(),
        description: description.trim(),
        panorama_url: cloudData.publicUrl,
        thumbnail_url: cloudData.thumbnail,
        duration: cloudData.duration ? `${cloudData.duration}s` : null,
        is_available: isAvailable,
        highlights: [],
        display_order: 0,
      });

      if (dbError) throw new Error(dbError);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-gray-900">Upload 360° Video</h2>
          <button onClick={onClose} disabled={uploading} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File picker */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
            {file ? (
              <div>
                <div className="text-3xl mb-2">🎬</div>
                <p className="font-semibold text-gray-900 text-sm">{file.name}</p>
                <p className="text-gray-400 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="font-semibold text-gray-700 text-sm">Click to select video</p>
                <p className="text-gray-400 text-xs mt-1">MP4, MOV, AVI — max 100MB</p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Main Library Tour"
              disabled={uploading}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this location..."
              rows={2}
              disabled={uploading}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Available toggle */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Make available now</p>
              <p className="text-xs text-gray-400">Users can view this tour immediately</p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              disabled={uploading}
              className={`relative w-11 h-6 rounded-full transition-colors ${isAvailable ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                <span>{progress < 100 ? 'Uploading to Cloudinary...' : 'Saving...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !title.trim() || uploading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <><Loader className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
            ) : (
              <><Upload className="w-4 h-4" /><span>Upload Video</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN PAGE ====================
const AdminPanoramas = () => {
  const [panoramas, setPanoramas] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchPanoramas(); }, []);

  const fetchPanoramas = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getAllPanoramas();
    if (fetchError) { setError(fetchError); setLoading(false); return; }
    setPanoramas(data || []);
    setLoading(false);
  };

  const handleDelete = async (panorama) => {
    if (!confirm(`Delete "${panorama.title}"?`)) return;
    const { error } = await deletePanorama(panorama.id, null);
    if (error) { alert('Failed to delete: ' + error); return; }
    fetchPanoramas();
  };

  const filteredPanoramas = panoramas.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
        <p className="text-gray-600 mb-4 text-sm">{error}</p>
        <button onClick={fetchPanoramas} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">360° Tours Management</h1>
          <p className="text-gray-500 text-sm">Upload and manage 360° video tours via Cloudinary</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload 360° Video</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{panoramas.length}</p>
            <p className="text-gray-500 text-xs">Total</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{panoramas.filter(p => p.is_available).length}</p>
            <p className="text-gray-500 text-xs">Available</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{panoramas.filter(p => !p.is_available).length}</p>
            <p className="text-gray-500 text-xs">Coming Soon</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPanoramas.map((panorama) => (
            <div key={panorama.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-44 bg-gray-200">
                {panorama.thumbnail_url ? (
                  <img src={panorama.thumbnail_url} alt={panorama.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Globe className="w-10 h-10 text-gray-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${panorama.is_available ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                    {panorama.is_available ? '✓ Live' : '⏳ Soon'}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  360°
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{panorama.title}</h3>
                {panorama.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{panorama.description}</p>}
                <div className="flex gap-2">
                  <a
                    href={panorama.panorama_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </a>
                  <button
                    onClick={() => handleDelete(panorama)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPanoramas.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <Globe className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">{searchQuery ? 'No Results' : 'No 360° Tours Yet'}</h3>
            <p className="text-gray-400 text-sm mb-4">{searchQuery ? 'Try different keywords.' : 'Upload your first 360° video.'}</p>
            {!searchQuery && (
              <button onClick={() => setShowUploadModal(true)} className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm">
                <Plus className="w-4 h-4" />
                <span>Upload 360° Video</span>
              </button>
            )}
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => { setShowUploadModal(false); fetchPanoramas(); }}
        />
      )}
    </div>
  );
};

export default AdminPanoramas;