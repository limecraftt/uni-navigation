// src/pages/Directions.jsx - SUPABASE INTEGRATED VERSION
import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Map, 
  Search,
  Phone,
  Mail,
  Clock,
  Building,
  GraduationCap,
  Users,
  FileText,
  MapPin,
  Loader,
  AlertCircle
} from 'lucide-react';
import IndoorNavigationModal from '../components/navigation/IndoorNavigationModal';
import { getAllOffices, getCompleteOfficeData } from '../api/officesApi';

const Directions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch offices from Supabase on component mount
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
    
    // Transform Supabase data to match your component structure
    const transformedOffices = data.map((office) => ({
      id: office.id,
      officeId: office.office_id,
      name: office.name,
      category: office.category,
      building: office.building,
      floor: office.floor,
      room: office.room,
      phone: office.phone,
      email: office.email,
      hours: office.hours,
      description: office.description
    }));
    
    setOffices(transformedOffices);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'All', icon: Building, color: 'bg-gray-100 text-gray-700' },
    { id: 'academic', name: 'Academic', icon: GraduationCap, color: 'bg-blue-100 text-blue-700' },
    { id: 'administrative', name: 'Administrative', icon: FileText, color: 'bg-green-100 text-green-700' },
    { id: 'services', name: 'Student Services', icon: Users, color: 'bg-purple-100 text-purple-700' }
  ];

  const filteredOffices = offices.filter(office => {
    const matchesSearch = office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         office.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         office.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || office.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'academic': return GraduationCap;
      case 'administrative': return FileText;
      case 'services': return Users;
      default: return Building;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'academic': return 'bg-blue-50 border-blue-200';
      case 'administrative': return 'bg-green-50 border-green-200';
      case 'services': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const handleGetDirections = async (office) => {
    // Fetch complete office data with navigation routes
    const { data, error } = await getCompleteOfficeData(office.officeId);
    
    if (error) {
      console.error('Error fetching office data:', error);
      // If no navigation data, still open modal with basic office info
      setSelectedOffice({
        ...office,
        indoorRoute: []
      });
      return;
    }
    
    setSelectedOffice(data);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Offices...</h3>
          <p className="text-gray-600">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOffices}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Offices and Departments</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find contact information and locations for all university offices and academic departments
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search offices, departments, or buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : category.color
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffices.map((office) => {
            const IconComponent = getCategoryIcon(office.category);
            
            return (
              <div
                key={office.id}
                className={`bg-white rounded-lg shadow-md border-2 p-6 hover:shadow-lg transition-shadow ${getCategoryColor(office.category)}`}
              >
                {/* Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {office.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {office.description}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{office.building}, {office.floor}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Map className="w-4 h-4 text-gray-500" />
                    <span>Room {office.room}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${office.phone}`} className="hover:text-blue-600">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${office.email}`} className="hover:text-blue-600 truncate">
                      {office.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs">{office.hours}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleGetDirections(office)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredOffices.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>

      {/* Indoor Navigation Modal */}
      {selectedOffice && (
        <IndoorNavigationModal
          office={selectedOffice}
          onClose={() => setSelectedOffice(null)}
        />
      )}
    </div>
  );
};

export default Directions;