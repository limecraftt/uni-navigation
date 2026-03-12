// src/pages/Directions.jsx
import React, { useState, useEffect } from 'react';
import {
  Navigation, Map, Search, Phone, Mail, Clock,
  Building, GraduationCap, Users, FileText, Loader, AlertCircle
} from 'lucide-react';
import IndoorNavigationModal from '../components/navigation/IndoorNavigationModal';
import { getAllOffices } from '../api/officesApi';

const Directions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchOffices(); }, []);

  const fetchOffices = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getAllOffices();
    if (fetchError) { setError(fetchError); setLoading(false); return; }
    setOffices(data.map((office) => ({
      id: office.id, officeId: office.office_id, name: office.name,
      category: office.category, building: office.building, floor: office.floor,
      room: office.room, phone: office.phone, email: office.email,
      hours: office.hours, description: office.description
    })));
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'All', icon: Building, color: 'bg-gray-100 text-gray-700' },
    { id: 'academic', name: 'Academic', icon: GraduationCap, color: 'bg-blue-100 text-blue-700' },
    { id: 'administrative', name: 'Administrative', icon: FileText, color: 'bg-green-100 text-green-700' },
    { id: 'services', name: 'Student Services', icon: Users, color: 'bg-purple-100 text-purple-700' }
  ];

  const filteredOffices = offices.filter(office => {
    const matchesSearch =
      office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (office.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (office.building || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || office.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return GraduationCap;
      case 'administrative': return FileText;
      case 'services': return Users;
      default: return Building;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'academic': return 'bg-blue-50 border-blue-200';
      case 'administrative': return 'bg-green-50 border-green-200';
      case 'services': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const handleGetDirections = (office) => { setSelectedOffice(office); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSelectedOffice(null); };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Loader className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Offices...</h3>
          <p className="text-gray-500 text-sm">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchOffices}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Offices and Departments</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Find contact information and locations for all university offices and academic departments
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search offices, departments, or buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                    selectedCategory === category.id ? 'bg-blue-600 text-white' : category.color
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredOffices.map((office) => {
            const IconComponent = getCategoryIcon(office.category);
            return (
              <div
                key={office.id}
                className={`bg-white rounded-2xl shadow-sm border-2 p-5 hover:shadow-md transition-shadow ${getCategoryColor(office.category)}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{office.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{office.description}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  {office.building && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{office.building}{office.floor ? `, ${office.floor}` : ''}</span>
                    </div>
                  )}
                  {office.room && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Map className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>Room {office.room}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 mb-4">
                  {office.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {/* ✅ attributes moved inside the opening <a> tag */}
                      <a href={`tel:${office.phone}`} className="hover:text-blue-600 active:text-blue-700">
                        {office.phone}
                      </a>
                    </div>
                  )}
                  {office.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {/* ✅ attributes moved inside the opening <a> tag */}
                      <a href={`mailto:${office.email}`} className="hover:text-blue-600 truncate active:text-blue-700">
                        {office.email}
                      </a>
                    </div>
                  )}
                  {office.hours && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs leading-snug">{office.hours}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleGetDirections(office)}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            );
          })}
        </div>

        {filteredOffices.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Results Found</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>

      <IndoorNavigationModal isOpen={showModal} office={selectedOffice} onClose={handleCloseModal} />
    </div>
  );
};

export default Directions;