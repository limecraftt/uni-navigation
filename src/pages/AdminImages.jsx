// src/pages/AdminImages.jsx
import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon,
  Plus, 
  Search, 
  Loader,
  AlertCircle,
  Trash2,
  Eye,
  Layout,
  X,
  Upload
} from 'lucide-react';
import { getCampusImagesByLocation, deleteCampusImage } from '../api/imagesApi';
import ImageUpload from '../components/admin/ImageUpload';

const AdminImages = () => {
  const [locations, setLocations] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showAddToLocationModal, setShowAddToLocationModal] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await getCampusImagesByLocation();
    
    if (fetchError) {
      setError(fetchError);
      setLoading(false);
      return;
    }
    
    setLocations(data || []);
    setLoading(false);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchImages();
  };

  // After adding images to a specific location, refresh and re-select that location
  const handleAddToLocationSuccess = async () => {
    setShowAddToLocationModal(false);
    await fetchImages();
    // Re-select the updated location so the manage modal reflects new images
    const { data } = await getCampusImagesByLocation ? { data: null } : { data: null };
    // We'll rely on fetchImages + find the updated location by name
    setLocations(prev => {
      const updated = prev.find(l => l.name === selectedLocation?.name);
      if (updated) setSelectedLocation(updated);
      return prev;
    });
  };

  // Refresh locations and update selectedLocation after adding images
  const handleAddSuccess = async () => {
    setShowAddToLocationModal(false);
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getCampusImagesByLocation();
    if (!fetchError && data) {
      setLocations(data);
      // Update selectedLocation with fresh data
      const refreshed = data.find(l => l.name === selectedLocation?.name);
      if (refreshed) setSelectedLocation(refreshed);
    }
    setLoading(false);
  };

  const handleDeleteClick = (image, locationName) => {
    setImageToDelete({ ...image, locationName });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    
    setDeleting(true);
    
    try {
      const imageUrl = imageToDelete.storagePath || imageToDelete.src;
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      
      const bucketIndex = pathParts.indexOf('campus-images');
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const storagePath = pathParts.slice(bucketIndex + 1).join('/');
        
        const { error } = await deleteCampusImage(imageToDelete.id, storagePath);
        
        setDeleting(false);
        
        if (error) {
          alert('Failed to delete image: ' + error);
          return;
        }
        
        setShowDeleteModal(false);
        setImageToDelete(null);

        // Refresh data and update selectedLocation
        const { data } = await getCampusImagesByLocation();
        if (data) {
          setLocations(data);
          const refreshed = data.find(l => l.name === selectedLocation?.name);
          if (refreshed) {
            setSelectedLocation(refreshed);
          } else {
            setSelectedLocation(null); // Location had only 1 image, now gone
          }
        }
      } else {
        throw new Error('Could not parse storage path');
      }
    } catch (err) {
      setDeleting(false);
      console.error('Delete error:', err);
      alert('Failed to delete image: ' + err.message);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Loading images...</h3>
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
            onClick={fetchImages}
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
            Campus Images Management
          </h1>
          <p className="text-gray-600">
            Upload and manage photos for the virtual tour gallery
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Images</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Locations</p>
                <p className="text-3xl font-bold text-gray-900">{locations.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Images</p>
                <p className="text-3xl font-bold text-gray-900">
                  {locations.reduce((sum, loc) => sum + loc.images.length, 0)}
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
                <p className="text-gray-600 text-sm">Categories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(locations.map(l => l.category)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Layout className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                {location.images.length > 0 ? (
                  <img
                    src={location.images[0].src}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {location.images.length} {location.images.length === 1 ? 'photo' : 'photos'}
                </div>

                <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  {location.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {location.name}
                </h3>
                
                {location.walkingTime && (
                  <p className="text-sm text-gray-600 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {location.walkingTime}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedLocation(location)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Manage</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredLocations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No Results Found' : 'No Images Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Start by uploading some campus images.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Upload Images</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal (new location) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <ImageUpload
                onSuccess={handleUploadSuccess}
                onClose={() => setShowUploadModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Location Detail / Manage Modal ─── */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-start flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedLocation.name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedLocation.images.length} {selectedLocation.images.length === 1 ? 'image' : 'images'} · {selectedLocation.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Add More Images button inside Manage modal */}
                <button
                  onClick={() => setShowAddToLocationModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Images</span>
                </button>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              {selectedLocation.images.length === 0 ? (
                <div className="text-center py-16">
                  <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No images yet for this location.</p>
                  <button
                    onClick={() => setShowAddToLocationModal(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload First Image</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedLocation.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.src}
                        alt={`${selectedLocation.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      
                      {/* Delete Button Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteClick(image, selectedLocation.name)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>

                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg truncate">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add More — inline card */}
                  <button
                    onClick={() => setShowAddToLocationModal(true)}
                    className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors group"
                  >
                    <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Add More</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Images to Existing Location Modal */}
      {showAddToLocationModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              {/* Pass pre-filled location data so the upload form knows which location */}
              <ImageUpload
                onSuccess={handleAddSuccess}
                onClose={() => setShowAddToLocationModal(false)}
                defaultLocation={{
                  name: selectedLocation.name,
                  category: selectedLocation.category,
                  walkingTime: selectedLocation.walkingTime,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && imageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Image?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this image from <strong>{imageToDelete.locationName}</strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setImageToDelete(null);
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImages;