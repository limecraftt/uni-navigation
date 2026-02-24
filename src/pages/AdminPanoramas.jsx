// src/pages/AdminPanoramas.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Loader,
  AlertCircle,
  Trash2,
  Eye,
  Layout,
  Globe
} from 'lucide-react';
import { getAllPanoramas, deletePanorama } from '../api/imagesApi';
import PanoramaUpload from '../components/admin/PanoramaUpload';

const AdminPanoramas = () => {
  const [panoramas, setPanoramas] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPanoramas();
  }, []);

  const fetchPanoramas = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await getAllPanoramas();
    
    if (fetchError) {
      setError(fetchError);
      setLoading(false);
      return;
    }
    
    setPanoramas(data || []);
    setLoading(false);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchPanoramas(); // Refresh the list
  };

  const handleDelete = async (panorama) => {
    if (!confirm(`Are you sure you want to delete "${panorama.title}"?`)) return;
    
    // Extract path from URL
    const urlParts = panorama.panorama_url.split('/');
    const path = urlParts[urlParts.length - 1];
    
    const { error } = await deletePanorama(panorama.id, path);
    
    if (error) {
      alert('Failed to delete panorama: ' + error);
      return;
    }
    
    fetchPanoramas(); // Refresh
  };

  const filteredPanoramas = panoramas.filter(panorama =>
    panorama.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (panorama.description && panorama.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Loading panoramas...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPanoramas}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            360° Panoramas Management
          </h1>
          <p className="text-gray-600">
            Upload and manage immersive 360° virtual tours
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search panoramas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Panorama</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Panoramas</p>
                <p className="text-3xl font-bold text-gray-900">{panoramas.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available Tours</p>
                <p className="text-3xl font-bold text-gray-900">
                  {panoramas.filter(p => p.is_available).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Coming Soon</p>
                <p className="text-3xl font-bold text-gray-900">
                  {panoramas.filter(p => !p.is_available).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Layout className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Panoramas Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPanoramas.map((panorama) => (
            <div
              key={panorama.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Preview */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={panorama.thumbnail_url || panorama.panorama_url}
                  alt={panorama.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    panorama.is_available
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {panorama.is_available ? '✓ Available' : '⏳ Coming Soon'}
                  </span>
                </div>

                {/* 360° Badge */}
                <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>360°</span>
                </div>
              </div>

              {/* Panorama Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {panorama.title}
                </h3>
                
                {panorama.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {panorama.description}
                  </p>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {panorama.duration}
                </div>

                {/* Highlights */}
                {panorama.highlights && panorama.highlights.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Highlights
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {panorama.highlights.slice(0, 3).map((highlight, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {highlight}
                        </span>
                      ))}
                      {panorama.highlights.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{panorama.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  
                    href={panorama.panorama_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  <a>
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </a>
                  
                  <button
                    onClick={() => handleDelete(panorama)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete Panorama"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPanoramas.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No Results Found' : 'No Panoramas Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Start by uploading your first 360° panorama.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Upload Panorama</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <PanoramaUpload
                onSuccess={handleUploadSuccess}
                onClose={() => setShowUploadModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanoramas;