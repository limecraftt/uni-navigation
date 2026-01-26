// src/pages/AdminVideos.jsx
import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Search, 
  Building,
  Loader,
  AlertCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { getAllOffices, getNavigationVideos } from '../api/officesApi';
import VideoUpload from '../components/admin/VideoUpload';

const AdminVideos = () => {
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [officeVideos, setOfficeVideos] = useState({});

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await getAllOffices();
    
    if (fetchError) {
      setError(fetchError);
      setLoading(false);
      return;
    }
    
    setOffices(data);
    
    // Fetch video counts for each office
    const videoCounts = {};
    for (const office of data) {
      const { data: videos } = await getNavigationVideos(office.id);
      videoCounts[office.id] = videos?.length || 0;
    }
    setOfficeVideos(videoCounts);
    
    setLoading(false);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setSelectedOffice(null);
    fetchOffices(); // Refresh the list
  };

  const filteredOffices = offices.filter(office =>
    office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    office.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Loading offices...</h3>
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
            onClick={fetchOffices}
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
            Navigation Videos Management
          </h1>
          <p className="text-gray-600">
            Upload and manage navigation videos for each office and department
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search offices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Offices Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffices.map((office) => {
            const videoCount = officeVideos[office.id] || 0;
            
            return (
              <div
                key={office.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <Building className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {office.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {office.building} - Room {office.room}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Count Badge */}
                <div className="mb-4">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    videoCount > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Video className="w-4 h-4" />
                    <span>{videoCount} video{videoCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOffice(office);
                      setShowUploadModal(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Video</span>
                  </button>
                  
                  {videoCount > 0 && (
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="View Videos"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredOffices.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms.
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedOffice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <VideoUpload
                office={selectedOffice}
                onSuccess={handleUploadSuccess}
                onClose={() => {
                  setShowUploadModal(false);
                  setSelectedOffice(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;